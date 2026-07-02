import Solution from '../models/Solution.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getPagination } from '../utils/helpers.js';

export const createSolution = asyncHandler(async (req, res) => {
  const { title, description, overview, category, industry, features, benefits, technologies, status } = req.body;

  const solution = new Solution({
    title,
    description,
    overview,
    category,
    industry,
    features,
    benefits,
    technologies,
    status: status || 'active'
  });

  await solution.save();

  res.status(201).json({
    ok: true,
    message: 'Solution created successfully',
    data: solution
  });
});

export const getAllSolutions = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { category, industry, search, status } = req.query;

  const filter = { isActive: true };

  if (status) {
    filter.status = status;
  } else {
    filter.status = { $ne: 'coming-soon' };
  }

  if (category) filter.category = category;
  if (industry) filter.industry = industry;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await Solution.countDocuments(filter);
  const solutions = await Solution.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: solutions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getSolutionById = asyncHandler(async (req, res) => {
  const solution = await Solution.findById(req.params.id)
    .populate('caseStudies');

  if (!solution) {
    return res.status(404).json({
      ok: false,
      message: 'Solution not found'
    });
  }

  res.status(200).json({
    ok: true,
    data: solution
  });
});

export const getSolutionBySlug = asyncHandler(async (req, res) => {
  const solution = await Solution.findOne({ slug: req.params.slug })
    .populate('caseStudies');

  if (!solution || (!solution.isActive && req.userRole !== 'admin')) {
    return res.status(404).json({
      ok: false,
      message: 'Solution not found'
    });
  }

  res.status(200).json({
    ok: true,
    data: solution
  });
});

export const getSolutionsByCategory = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { category } = req.params;

  const filter = { category, isActive: true, status: { $ne: 'coming-soon' } };

  const total = await Solution.countDocuments(filter);
  const solutions = await Solution.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: solutions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const updateSolution = asyncHandler(async (req, res) => {
  let solution = await Solution.findById(req.params.id);

  if (!solution) {
    return res.status(404).json({
      ok: false,
      message: 'Solution not found'
    });
  }

  // Admin only
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Not authorized to update solutions'
    });
  }

  solution = await Solution.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('caseStudies');

  res.status(200).json({
    ok: true,
    message: 'Solution updated successfully',
    data: solution
  });
});

export const deleteSolution = asyncHandler(async (req, res) => {
  const solution = await Solution.findById(req.params.id);

  if (!solution) {
    return res.status(404).json({
      ok: false,
      message: 'Solution not found'
    });
  }

  // Admin only
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Not authorized to delete solutions'
    });
  }

  await Solution.findByIdAndDelete(req.params.id);

  res.status(200).json({
    ok: true,
    message: 'Solution deleted successfully'
  });
});

export const getSolutionsByIndustry = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { industry } = req.params;

  const filter = {
    industry: industry,
    isActive: true,
    status: { $ne: 'coming-soon' }
  };

  const total = await Solution.countDocuments(filter);
  const solutions = await Solution.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: solutions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getFeaturedSolutions = asyncHandler(async (req, res) => {
  const solutions = await Solution.find({
    isActive: true,
    status: 'active'
  })
    .sort({ displayOrder: 1 })
    .limit(6);

  res.status(200).json({
    ok: true,
    data: solutions
  });
});
