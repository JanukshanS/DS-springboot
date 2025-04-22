import axios from 'axios';

/**
 * Upload an image to ImgBB and return the URL
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImage = async (file) => {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append('image', file);
    
    // Use ImgBB's free API for temporary image hosting
    // This is a temporary solution - in production you would use your own API key
    const response = await axios.post(
      'https://api.imgbb.com/1/upload?key=30aa6277965f5a1dd88e0a5d1680c65e',
      formData
    );
    
    // Check if the upload was successful
    if (response.data && response.data.data) {
      // Use display_url which is better for direct image display
      // It's also more reliable for backend storage
      console.log('ImgBB response:', response.data.data);
      return response.data.data.display_url || response.data.data.url;
    } else {
      throw new Error('Failed to get image URL from ImgBB');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Fallback to a placeholder image if upload fails
    return 'https://via.placeholder.com/150?text=Restaurant';
  }
};

/**
 * Extract the public ID from a Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not found
 */
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  try {
    // Extract the public ID from the URL
    // Format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public-id.jpg
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicIdWithExtension = fileName.split('.');
    
    // Return the public ID without the extension
    return publicIdWithExtension[0];
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};
