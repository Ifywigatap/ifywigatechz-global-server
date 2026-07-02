import BlogPost from '../models/BlogPost.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getPagination } from '../utils/helpers.js';

export const createBlogPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, tags, featuredImage, status } = req.body;

  const blogPost = new BlogPost({
    title,
    content,
    excerpt,
    category,
    tags: tags || [],
    featuredImage,
    status: status || 'draft',
    author: req.userId
  });

  await blogPost.save();
  await blogPost.populate('author', 'name email avatar');

  res.status(201).json({
    ok: true,
    message: 'Blog post created successfully',
    data: blogPost
  });
});

export const getAllBlogPosts = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { category, status, search } = req.query;

  const filter = { status: 'published' };

  if (category) filter.category = category;
  if (status && req.userRole === 'admin') filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await BlogPost.countDocuments(filter);
  const posts = await BlogPost.find(filter)
    .populate('author', 'name email avatar')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug }).populate(
    'author',
    'name email avatar'
  );

  if (!post) {
    return res.status(404).json({
      ok: false,
      message: 'Blog post not found'
    });
  }

  // Increment view count
  post.viewCount = (post.viewCount || 0) + 1;
  await post.save();

  res.status(200).json({
    ok: true,
    data: post
  });
});

export const updateBlogPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, tags, featuredImage, status } = req.body;

  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      ok: false,
      message: 'Blog post not found'
    });
  }

  if (post.author.toString() !== req.userId && req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'You are not authorized to update this post'
    });
  }

  Object.assign(post, {
    ...(title && { title }),
    ...(content && { content }),
    ...(excerpt && { excerpt }),
    ...(category && { category }),
    ...(tags && { tags }),
    ...(featuredImage && { featuredImage }),
    ...(status && { status })
  });

  await post.save();
  await post.populate('author', 'name email avatar');

  res.status(200).json({
    ok: true,
    message: 'Blog post updated successfully',
    data: post
  });
});

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      ok: false,
      message: 'Blog post not found'
    });
  }

  if (post.author.toString() !== req.userId && req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'You are not authorized to delete this post'
    });
  }

  await BlogPost.findByIdAndDelete(req.params.id);

  res.status(200).json({
    ok: true,
    message: 'Blog post deleted successfully'
  });
});

export const likeBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!post) {
    return res.status(404).json({
      ok: false,
      message: 'Blog post not found'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Post liked successfully',
    data: post
  });
});

export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      ok: false,
      message: 'Blog post not found'
    });
  }

  post.comments.push({
    author: req.userId,
    text
  });

  await post.save();
  await post.populate('comments.author', 'name avatar email');

  res.status(201).json({
    ok: true,
    message: 'Comment added successfully',
    data: post
  });
});
