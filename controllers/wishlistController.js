import Wishlist from '../models/Wishlist.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.userId }).populate('items.productId');
  res.status(200).json({ ok: true, data: wishlist || { items: [] } });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Use findOneAndUpdate with upsert to create or update the wishlist in one go
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.userId },
    { $addToSet: { items: { productId } } },
    { new: true, upsert: true }
  ).populate('items.productId');

  res.status(200).json({ ok: true, message: 'Added to wishlist', data: wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.userId },
    { $pull: { items: { productId } } },
    { new: true }
  ).populate('items.productId');

  res.status(200).json({ ok: true, message: 'Removed from wishlist', data: wishlist });
});
