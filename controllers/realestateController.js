import UserProperty from '../models/UserProperty.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getProperties = asyncHandler(async (req, res) => {
  // Fetch all active properties
  // Sort by isFeatured descending (true comes before false) and then by creation date
  const properties = await UserProperty.find({ status: 'active' }).sort({ 
    isFeatured: -1, 
    createdAt: -1 
  });
  res.status(200).json({ ok: true, data: properties });
});

export const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const property = await UserProperty.findById(id);
  
  if (!property) {
    return res.status(404).json({ ok: false, message: 'Property not found' });
  }
  
  res.status(200).json({ ok: true, data: property });
});

export const postProperty = asyncHandler(async (req, res) => {
  const { images, ...otherData } = req.body;

  let uploadedImages = [];

  if (images && Array.isArray(images)) {
    // Upload all images to Cloudinary concurrently
    uploadedImages = await Promise.all(
      images.map(async (image, index) => {        
        const propertyFolder = `ifywigatechz/properties/${otherData.propertyType ? otherData.propertyType.toLowerCase().replace(/\s+/g, '-') : 'general'}`;

        const result = await cloudinary.uploader.upload(image, {
          folder: propertyFolder,
        });
        return {
          url: result.secure_url,
          public_id: result.public_id,
          isPrimary: index === 0 // Mark the first image as primary by default
        };
      })
    );
  }

  const property = new UserProperty({
    ...otherData,
    images: uploadedImages,
    userId: req.userId
  });

  await property.save();
  res.status(201).json({ ok: true, message: 'Property posted successfully', data: property });
});

export const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { images: keptImages, newImages, ...updateData } = req.body;

  const property = await UserProperty.findById(id);
  if (!property) {
    return res.status(404).json({ ok: false, message: 'Property not found' });
  }

  // Authorization check: Only the owner can update
  if (property.userId.toString() !== req.userId) {
    return res.status(403).json({ ok: false, message: 'Not authorized to update this listing' });
  }

  // 1. Handle Deletions: Identify images removed by the user and destroy them in Cloudinary
  const keptPublicIds = (keptImages || []).map(img => img.public_id);
  const imagesToRemove = property.images.filter(img => !keptPublicIds.includes(img.public_id));

  if (imagesToRemove.length > 0) {
    await Promise.all(imagesToRemove.map(img => cloudinary.uploader.destroy(img.public_id)));
  }
  
  const propertyFolder = `ifywigatechz/properties/${updateData.propertyType ? updateData.propertyType.toLowerCase().replace(/\s+/g, '-') : 'general'}`;
  
  // 2. Handle New Uploads: Upload new Base64 strings to Cloudinary
  let uploadedImages = [];
  if (newImages && Array.isArray(newImages)) {
    uploadedImages = await Promise.all(
      newImages.map(async (image) => {
        const result = await cloudinary.uploader.upload(image, {
          folder: propertyFolder,
        });
        return { url: result.secure_url, public_id: result.public_id, isPrimary: false };
      })
    );
  }

  // 3. Sync Image Array: Combine kept images and newly uploaded ones
  property.images = [...(keptImages || []), ...uploadedImages];

  // Safety check: ensure at least one image is marked as primary
  if (property.images.length > 0 && !property.images.some(img => img.isPrimary)) {
    property.images[0].isPrimary = true;
  }

  // 4. Update other fields
  Object.assign(property, updateData);
  await property.save();

  res.status(200).json({ ok: true, message: 'Property updated successfully', data: property });
});

export const deleteProperty = asyncHandler(async (req, res) => {
  // Note: findOneAndDelete triggers the pre-delete hook in UserProperty.js for Cloudinary cleanup
  const property = await UserProperty.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!property) return res.status(404).json({ ok: false, message: 'Property not found or unauthorized' });
  res.status(200).json({ ok: true, message: 'Property and associated images deleted successfully' });
});
