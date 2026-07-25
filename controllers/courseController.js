import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import Enrollment from '../models/Enrollment.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getPagination } from '../utils/helpers.js';
import mongoose from 'mongoose';

// Helper function to stream a buffer to Cloudinary
const uploadStream = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    stream.end(buffer);
  });
};

// Helper to redact video URLs if the user is not authorized to see them
const secureCourseContent = async (course, userId, userRole) => {
  const isEnrolled = userId ? await Enrollment.exists({ user: userId, course: course._id }) : false;
  const isAdmin = userRole === 'admin';
  const hasAccess = isAdmin || isEnrolled;
  
  const courseObj = course.toObject();

  courseObj.modules = courseObj.modules.map(module => ({
    ...module,
    lessons: module.lessons.map(lesson => {
      const { videoUrl } = lesson;
      const isFreePreview = videoUrl && videoUrl === course.freeLesson;

      // Determine if the user should see the video
      if (hasAccess || isFreePreview) {
        // Generate a signed URL if it is a Cloudinary asset
        if (videoUrl && videoUrl.includes('cloudinary.com')) {
          const parts = videoUrl.split('/');
          const uploadIdx = parts.indexOf('upload');
          const authIdx = parts.indexOf('authenticated');
          const baseIdx = uploadIdx !== -1 ? uploadIdx : authIdx;

          if (baseIdx !== -1) {
            // Extract Public ID (handles folders and ignores version/extension)
            let pathParts = parts.slice(baseIdx + 1);
            if (pathParts[0].startsWith('v')) pathParts.shift(); 
            const filename = pathParts.pop();
            const publicId = [...pathParts, filename.split('.')[0]].join('/');

            return {
              ...lesson,
              videoUrl: cloudinary.url(publicId, {
                resource_type: 'video',
                type: authIdx !== -1 ? 'authenticated' : 'upload',
                sign_url: true,
                expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiration
              })
            };
          }
        }
        return lesson; // Return as is if not Cloudinary or already signed
      }

      // Not authorized and not a free preview: Remove the videoUrl
      const { videoUrl: _, ...lessonData } = lesson;
      return lessonData;
    })
  }));
  
  return courseObj;
};

// Helper to find course by numeric ID, MongoDB ObjectId, or Slug
const findCourse = async (identifier, populateOpts = null) => {
  let course = null;
  const numericId = parseInt(identifier);
  
  const attachPopulate = (query) => populateOpts ? query.populate(populateOpts.path, populateOpts.select) : query;
  
  if (!isNaN(numericId)) course = await attachPopulate(Course.findOne({ courseId: numericId }));
  if (!course && mongoose.isValidObjectId(identifier)) course = await attachPopulate(Course.findById(identifier));
  if (!course) course = await attachPopulate(Course.findOne({ slug: identifier }));
  
  return course;
};

export const createCourse = asyncHandler(async (req, res) => {
  // Course data is sent as a stringified JSON field to support multipart/form-data
  const courseData = JSON.parse(req.body.courseData);
  const { title, description, excerpt, category, level, price, discountPrice, duration, thumbnail, instructor, modules, ...rest } = courseData;
  const files = req.files; // Array of video files from multer
  let fileIndex = 0;

  // Process modules to handle video uploads via streaming
  const processedModules = modules ? await Promise.all(modules.map(async (module) => {
    const lessons = await Promise.all((module.lessons || []).map(async (lesson) => {
      // The client sends a placeholder `video: "UPLOAD"` to indicate a file should be uploaded for this lesson
      if (lesson.video === 'UPLOAD' && files && files[fileIndex]) {
        const file = files[fileIndex];
        fileIndex++;

        // Stream the file buffer to Cloudinary
        const result = await uploadStream(file.buffer, {
          resource_type: 'video',
          type: 'authenticated',
          folder: `ifywigatechz/courses/${title.toLowerCase().replace(/\s+/g, '-')}/videos`,
        });
        
        // Replace the placeholder with the actual secure URL
        const { video, ...restOfLesson } = lesson;
        return { ...restOfLesson, videoUrl: result.secure_url };
      }
      return lesson; // Return lesson as is if no video upload is indicated
    }));
    return { ...module, lessons };
  })) : [];

  const course = new Course({
    ...rest,
    title,
    description,
    excerpt,
    category,
    level,
    price,
    discountPrice,
    duration,
    thumbnail,
    instructor: instructor || { name: 'Ify Wigatap', title: 'Tech Instructor', avatar: '/instructors/ify.jpg' },
    modules: processedModules
  });
  await course.save();

  res.status(201).json({
    ok: true,
    message: 'Course created successfully',
    data: course
  });
});

export const updateModuleProgress = asyncHandler(async (req, res) => {
  const { courseId, moduleId } = req.body;
  const userId = req.userId;

  if (!courseId || !moduleId) {
    return res.status(400).json({ ok: false, message: 'courseId and moduleId are required' });
  }

  // $addToSet ensures the moduleId is only added if it doesn't already exist (idempotent!)
  const progress = await CourseProgress.findOneAndUpdate(
    { userId, courseId },
    { 
      $addToSet: { completedModules: String(moduleId) },
      $set: { lastAccessed: Date.now() }
    },
    { new: true, upsert: true } // Create document if it doesn't exist
  );

  res.status(200).json({
    ok: true,
    message: 'Progress updated successfully',
    data: progress
  });
});

export const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;

  const progress = await CourseProgress.findOne({ userId, courseId });

  res.status(200).json({
    ok: true,
    data: progress || { completedModules: [] }
  });
});

export const getCourseCompletionPercentage = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { totalModules } = req.query; // Fallback for hardcoded academy courses
  const userId = req.userId;

  // 1. Fetch user's progress for the course
  const progress = await CourseProgress.findOne({ userId, courseId });
  const completedCount = progress ? progress.completedModules.length : 0;

  let total = 0;

  // 2. Determine total modules
  // First, try to find the course in the database
  const course = await findCourse(courseId);
  if (course && course.modules) {
    total = course.modules.length;
  } else if (totalModules && !isNaN(parseInt(totalModules))) {
    // Fallback to query parameter for hardcoded courses (e.g., ai, web3)
    total = parseInt(totalModules);
  } else {
    return res.status(400).json({
      ok: false,
      message: 'Course not found in DB. Please provide ?totalModules=X in the query string for academy courses.'
    });
  }

  // 3. Calculate percentage (rounded to nearest whole number)
  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  res.status(200).json({
    ok: true,
    data: {
      courseId,
      completedModules: completedCount,
      totalModules: total,
      percentage
    }
  });
});

export const getAllCourses = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { category, level, search } = req.query;

  const filter = { status: 'published', isActive: true };

  if (category) filter.category = category;
  if (level) filter.level = level;
  
  let sortOption = { createdAt: -1 };
  let projection = null;

  if (search) {
    filter.$text = { $search: search };
    // Sort results by how well they match the search string
    projection = { score: { $meta: 'textScore' } };
    sortOption = { score: { $meta: 'textScore' } };
  }

  const total = await Course.countDocuments(filter);
  const courses = await Course.find(filter, projection)
    .skip(skip)
    .limit(limit)
    .sort(sortOption);

  res.status(200).json({
    ok: true,
    data: courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await findCourse(id);

  if (!course) {
    return res.status(404).json({
      ok: false,
      message: 'Course not found'
    });
  }

  // Attach enrolled students back onto the object so the frontend doesn't break
  const enrollments = await Enrollment.find({ course: course._id }).populate('user', 'name email avatar');
  const courseData = await secureCourseContent(course, req.userId, req.userRole);
  courseData.enrolledStudents = enrollments.map(e => e.user);

  res.status(200).json({
    ok: true,
    data: courseData
  });
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });

  if (!course || (!course.isActive && req.userRole !== 'admin')) {
    return res.status(404).json({
      ok: false,
      message: 'Course not found'
    });
  }

  const courseData = await secureCourseContent(course, req.userId, req.userRole);

  res.status(200).json({
    ok: true,
    data: courseData
  });
});

export const getCoursesByCategory = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { category } = req.params;

  const filter = { category, status: 'published', isActive: true };

  const total = await Course.countDocuments(filter);
  const courses = await Course.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let course = await findCourse(id);

  if (!course) {
    return res.status(404).json({
      ok: false,
      message: 'Course not found'
    });
  }

  // Check authorization - only admins can update
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Not authorized to update this course'
    });
  }

  const courseData = JSON.parse(req.body.courseData);
  const { modules, ...updateData } = courseData;
  const files = req.files;
  let fileIndex = 0;

  let processedModules = course.modules; // Start with existing modules

  if (modules) {
    processedModules = await Promise.all(modules.map(async (module) => {
      const lessons = await Promise.all((module.lessons || []).map(async (lesson) => {
        // If a new video is being uploaded for this lesson
        if (lesson.video === 'UPLOAD' && files && files[fileIndex]) {
          const file = files[fileIndex];
          fileIndex++;

          const result = await uploadStream(file.buffer, {
            resource_type: 'video',
            type: 'authenticated',
            folder: `ifywigatechz/courses/${course.title.toLowerCase().replace(/\s+/g, '-')}/videos`,
          });
          
          // Return a new lesson object with the new videoUrl, removing the placeholder
          const { video, ...restOfLesson } = lesson;
          return { ...restOfLesson, videoUrl: result.secure_url };
        }
        
        // If no new video, return the lesson data as sent from the client.
        // The client is responsible for sending the existing `videoUrl` if it should be kept.
        const { video, ...restOfLesson } = lesson;
        return restOfLesson;
      }));
      return { ...module, lessons };
    }));
  }

  course = await Course.findByIdAndUpdate(course._id, {
    ...updateData,
    modules: processedModules
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    ok: true,
    message: 'Course updated successfully',
    data: course
  });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let course = await findCourse(id);

  if (!course) {
    return res.status(404).json({
      ok: false,
      message: 'Course not found'
    });
  }

  // Check authorization - only admins can delete (instructor field is now embedded)
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Not authorized to delete this course'
    });
  }

  await Course.findByIdAndDelete(course._id);

  res.status(200).json({
    ok: true,
    message: 'Course deleted successfully'
  });
});

export const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      ok: false,
      message: 'Course not found'
    });
  }

  // Check if already enrolled
  const isEnrolled = await Enrollment.exists({ user: req.userId, course: course._id });
  if (isEnrolled) {
    return res.status(400).json({
      ok: false,
      message: 'Already enrolled in this course'
    });
  }

  await Enrollment.create({ user: req.userId, course: course._id });

  res.status(200).json({
    ok: true,
    message: 'Successfully enrolled in course',
    data: course
  });
});

export const getEnrolledCourses = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);

  const enrollments = await Enrollment.find({ user: req.userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name email avatar' }
    });

  const courses = enrollments.map(e => e.course).filter(Boolean);
  const total = await Enrollment.countDocuments({ user: req.userId });

  res.status(200).json({
    ok: true,
    data: courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const addCourseReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      ok: false,
      message: 'Course not found'
    });
  }

  // Check if user is enrolled
  const isEnrolled = await Enrollment.exists({ user: req.userId, course: course._id });
  if (!isEnrolled) {
    return res.status(403).json({
      ok: false,
      message: 'You must be enrolled to review this course'
    });
  }

  // Check if already reviewed
  const existingReview = course.reviews.find(r => r.userId.toString() === req.userId);
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    course.reviews.push({
      userId: req.userId,
      rating,
      comment
    });
  }

  // Update rating average
  const avgRating = course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length;
  course.ratings.average = avgRating;
  course.ratings.count = course.reviews.length;

  await course.save();
  await course.populate('instructor', 'name email avatar');

  res.status(200).json({
    ok: true,
    message: 'Review added successfully',
    data: course
  });
});

export const getAllEnrolledStudents = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate('course', 'title category')
    .populate('user', 'name email avatar');

  const formattedEnrollments = enrollments
    .filter(enrollment => enrollment.course && enrollment.user)
    .map(enrollment => ({
      courseId: enrollment.course._id,
      courseTitle: enrollment.course.title,
      courseCategory: enrollment.course.category,
      student: enrollment.user
    }));

  res.status(200).json({ ok: true, data: formattedEnrollments });
});
