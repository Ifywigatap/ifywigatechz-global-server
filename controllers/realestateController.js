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
  // The client now sends a single 'images' array, which can contain
  // existing image objects and new image base64 strings.
  const { images: incomingImages, ...updateData } = req.body;

  const property = await UserProperty.findById(id);
  if (!property) {
    return res.status(404).json({ ok: false, message: 'Property not found' });
  }

  // Authorization check
  if (property.userId.toString() !== req.userId) {
    return res.status(403).json({ ok: false, message: 'Not authorized to update this listing' });
  }

  // --- Refactored Image Handling Logic ---

  const existingPublicIds = new Set(property.images.map(img => img.public_id));
  const incomingPublicIds = new Set(
    (incomingImages || [])
      .filter(img => typeof img === 'object' && img.public_id)
      .map(img => img.public_id)
  );

  // 1. Identify images to delete from Cloudinary by diffing the sets
  const publicIdsToDelete = [...existingPublicIds].filter(publicId => !incomingPublicIds.has(publicId));

  // 2. Identify new base64 images to upload
  const imagesToUpload = (incomingImages || []).filter(img => typeof img === 'string' && img.startsWith('data:image'));

  // 3. Perform Cloudinary deletions and uploads concurrently
  const propertyFolder = `ifywigatechz/properties/${updateData.propertyType ? updateData.propertyType.toLowerCase().replace(/\s+/g, '-') : 'general'}`;

  const [, uploadResults] = await Promise.all([
    Promise.all(publicIdsToDelete.map(publicId => cloudinary.uploader.destroy(publicId))),
    Promise.all(imagesToUpload.map(base64Image => 
      cloudinary.uploader.upload(base64Image, { folder: propertyFolder })
    ))
  ]);

  // 4. Construct the final image array for the database
  let uploadIndex = 0;
  const finalImages = (incomingImages || [])
    .map(img => {
      if (typeof img === 'object' && img.public_id) {
        return img; // This is an existing image that was kept.
      }
      if (typeof img === 'string' && img.startsWith('data:image')) {
        // This was a new image; replace the base64 with the Cloudinary result.
        const result = uploadResults[uploadIndex++];
        return { url: result.secure_url, public_id: result.public_id, isPrimary: false };
      }
      return null; // Ignore malformed entries
    })
    .filter(Boolean);

  // Safety check: ensure at least one image is marked as primary.
  if (finalImages.length > 0 && !finalImages.some(img => img.isPrimary)) {
    finalImages[0].isPrimary = true;
  }

  // 5. Update the property document with the new data and final image array
  property.images = finalImages;
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
