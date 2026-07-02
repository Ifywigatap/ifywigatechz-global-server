/**
 * Normalize product data - converts MongoDB _id to id
 */
export const normalizeProduct = (product) => {
  if (!product) return null;
  
  const normalized = product.toObject?.() || product;
  return {
    ...normalized,
    id: normalized._id?.toString() || normalized.id
  };
};

/**
 * Normalize array of products
 */
export const normalizeProducts = (products) => {
  return products.map(normalizeProduct);
};
