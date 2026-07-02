import CaseStudy from '../models/CaseStudy.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getPagination } from '../utils/helpers.js';

// Helper to find case study by numeric ID, MongoDB ObjectId, or Slug
const findCaseStudy = async (identifier) => {
  let caseStudy = null;
  const numericId = parseInt(identifier);
  
  if (!isNaN(numericId)) caseStudy = await CaseStudy.findOne({ caseStudyId: numericId });
  if (!caseStudy && mongoose.isValidObjectId(identifier)) caseStudy = await CaseStudy.findById(identifier);
  if (!caseStudy) caseStudy = await CaseStudy.findOne({ slug: identifier });
  
  return caseStudy;
};

import mongoose from 'mongoose'; // Add mongoose import

export const createCaseStudy = asyncHandler(async (req, res) => {
  const { title, company, industry, challenge, solution, technologies, results, testimonial, link, status, featured } = req.body;

  const caseStudy = new CaseStudy({
    title,
    company,
    industry,
    challenge,
    solution,
    technologies: technologies || [],
    results: results || [],
    testimonial,
    link,
    status: status || 'draft',
    featured: featured || false
  });

  await caseStudy.save();

  res.status(201).json({
    ok: true,
    message: 'Case study created successfully',
    data: caseStudy
  });
});

export const getAllCaseStudies = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { industry, featured } = req.query;

  const filter = { status: 'published' };

  if (industry) filter.industry = industry;
  if (featured === 'true') filter.featured = true;

  const total = await CaseStudy.countDocuments(filter);
  const caseStudies = await CaseStudy.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: caseStudies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getCaseStudyById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const caseStudy = await findCaseStudy(id);
  if (!caseStudy) {
    return res.status(404).json({
      ok: false,
      message: 'Case study not found'
    });
  }

  res.status(200).json({
    ok: true,
    data: caseStudy
  });
});

export const getCaseStudyBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const caseStudy = await findCaseStudy(slug);
  if (!caseStudy) {
    return res.status(404).json({
      ok: false,
      message: 'Case study not found'
    });
  }

  res.status(200).json({
    ok: true,
    data: caseStudy
  });
});

export const updateCaseStudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, company, industry, challenge, solution, technologies, results, testimonial, link, status, featured } = req.body;
  let caseStudy = await findCaseStudy(id);
  if (!caseStudy) {
    return res.status(404).json({
      ok: false,
      message: 'Case study not found'
    });
  }

  caseStudy = await CaseStudy.findByIdAndUpdate(
    caseStudy._id,
    {
      ...(title && { title }),
      ...(company && { company }),
      ...(industry && { industry }),
      ...(challenge && { challenge }),
      ...(solution && { solution }),
      ...(technologies && { technologies }),
      ...(results && { results }),
      ...(testimonial && { testimonial }),
      ...(link && { link }),
      ...(status && { status }),
      ...(featured !== undefined && { featured })
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    ok: true,
    message: 'Case study updated successfully',
    data: caseStudy
  });
});

export const deleteCaseStudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let caseStudy = await findCaseStudy(id);
  if (!caseStudy) {
    return res.status(404).json({
      ok: false,
      message: 'Case study not found'
    });
  }

  await CaseStudy.findByIdAndDelete(caseStudy._id);

  res.status(200).json({
    ok: true,
    message: 'Case study deleted successfully'
  });
});
