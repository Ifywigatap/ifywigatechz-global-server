import Cart from '../models/Cart.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
  res.status(200).json({ ok: true, data: cart || { items: [] } });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  let cart = await Cart.findOne({ userId: req.userId });
  
  if (!cart) {
    cart = new Cart({ userId: req.userId, items: [{ productId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  res.status(200).json({ ok: true, data: cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId: req.userId });
  if (!cart) return res.status(404).json({ ok: false, message: 'Cart not found' });

  const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = Math.max(0, quantity);
    cart.items = cart.items.filter(item => item.quantity > 0); // Remove if quantity is 0
    await cart.save();
  }
  res.status(200).json({ ok: true, data: cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId });
  if (cart) {
    cart.items = cart.items.filter(p => p.productId.toString() !== req.params.productId);
    await cart.save();
  }
  res.status(200).json({ ok: true, data: cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.userId });
  res.status(200).json({ ok: true, data: { items: [] } });
});
