import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getPagination } from '../utils/helpers.js';
import { normalizeProduct, normalizeProducts } from '../utils/normalization.js';
import mongoose from 'mongoose'; // Add mongoose import

// Helper to find product by numeric ID, MongoDB ObjectId, or Slug
const findProduct = async (identifier, populateOpts = null) => {
  let product = null;
  const numericId = parseInt(identifier);
  
  const attachPopulate = (query) => populateOpts ? query.populate(populateOpts.path, populateOpts.select) : query;
  
  if (!isNaN(numericId)) product = await attachPopulate(Product.findOne({ productId: numericId }));
  if (!product && mongoose.isValidObjectId(identifier)) product = await attachPopulate(Product.findById(identifier));
  if (!product) product = await attachPopulate(Product.findOne({ slug: identifier }));
  
  return product;
};

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, shortDescription, category, price, discountPrice, images, features, stock } = req.body;

  const product = new Product({
    name,
    description,
    shortDescription,
    category,
    price,
    discountPrice,
    images,
    features,
    stock,
    vendor: req.userId
  });

  await product.save();
  await product.populate('vendor', 'name email avatar');

  res.status(201).json({
    ok: true,
    message: 'Product created successfully',
    data: normalizeProduct(product)
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { category, minPrice, maxPrice, search, status } = req.query;

  const filter = { status: 'active' };
  let sortOption = { createdAt: -1 };
  let projection = null;

  if (category) filter.mainCategory = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  if (search) {
    filter.$text = { $search: search };
    projection = { score: { $meta: 'textScore' } };
    sortOption = { score: { $meta: 'textScore' } };
  }
  if (status && req.userRole === 'admin') {
    filter.status = status;
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter, projection)
    .populate('vendor', 'name email avatar')
    .skip(skip)
    .limit(limit)
    .sort(sortOption);

  res.status(200).json({
    ok: true,
    data: normalizeProducts(products),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let product = await findProduct(id, { path: 'vendor', select: 'name email avatar' });
  if (!product) {
    return res.status(404).json({
      ok: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    ok: true,
    data: normalizeProduct(product)
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('vendor', 'name email avatar');

  if (!product) {
    return res.status(404).json({
      ok: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    ok: true,
    data: normalizeProduct(product)
  });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { category } = req.params;

  const filter = { mainCategory: category, status: 'active' };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('vendor', 'name email avatar')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: normalizeProducts(products),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { skip, limit, page } = getPagination(req.query);

  if (!q) {
    return res.status(400).json({
      ok: false,
      message: 'Search query is required'
    });
  }

  const filter = {
    status: 'active',
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ]
  };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('vendor', 'name email avatar')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    ok: true,
    data: normalizeProducts(products),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let product = await findProduct(id);
  if (!product) {
    return res.status(404).json({
      ok: false,
      message: 'Product not found'
    });
  }

  // Check authorization
  if (product.vendor.toString() !== req.userId && req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Not authorized to update this product'
    });
  }

  product = await Product.findByIdAndUpdate(product._id, req.body, {
    new: true,
    runValidators: true
  }).populate('vendor', 'name email avatar');

  res.status(200).json({
    ok: true,
    message: 'Product updated successfully',
    data: normalizeProduct(product)
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let product = await findProduct(id);
  if (!product) {
    return res.status(404).json({
      ok: false,
      message: 'Product not found'
    });
  }

  // Check authorization
  if (product.vendor.toString() !== req.userId && req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Not authorized to delete this product'
    });
  }

  await Product.findByIdAndDelete(product._id);

  res.status(200).json({
    ok: true,
    message: 'Product deleted successfully'
  });
});

export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      ok: false,
      message: 'Product not found'
    });
  }

  // Check if already reviewed
  const existingReview = product.reviews.find(r => r.userId.toString() === req.userId);
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      userId: req.userId,
      rating,
      comment
    });
  }

  // Update rating average
  const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
  product.ratings.average = avgRating;
  product.ratings.count = product.reviews.length;

  await product.save();
  await product.populate('vendor', 'name email avatar');

  res.status(200).json({
    ok: true,
    message: 'Review added successfully',
    data: normalizeProduct(product)
  });
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 4 } = req.query;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      ok: false,
      message: 'Product not found'
    });
  }

  // Find related products by mainCategory or subCategory
  const relatedProducts = await Product.find({
    _id: { $ne: id },
    status: 'active',
    $or: [
      { mainCategory: product.mainCategory },
      { subCategory: product.subCategory }
    ]
  })
    .populate('vendor', 'name email avatar')
    .limit(parseInt(limit))
    .sort({ rating: -1, createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: normalizeProducts(relatedProducts)
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const products = await Product.find({
    status: 'active'
  })
    .populate('vendor', 'name email avatar')
    .limit(parseInt(limit))
    .sort({ rating: -1, createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: normalizeProducts(products)
  });
});

export const getSaleProducts = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);

  const filter = {
    status: 'active',
    discountPrice: { $exists: true, $gt: 0 }
  };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('vendor', 'name email avatar')
    .skip(skip)
    .limit(limit)
    .sort({ discountPrice: 1, createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: normalizeProducts(products),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
