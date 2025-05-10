// import { V2 as cloudinary } from 'cloudinary';
// import { v4 as uuidv4 } from 'uuid';

// cloudinary.config({
//     cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
//     api_key: import.meta.env.CLOUDINARY_API_KEY,
//     api_secret: import.meta.env.CLOUDINARY_API_SECRET,
//     url: import.meta.env.CLOUDINARY_URL,
// });

// export const uploadImage = async (file) => {
//   const uniqueFilename = uuidv4();
//   const result = await cloudinary.uploader.upload(file, {
//     public_id: `ds/${uniqueFilename}`,
//   });
//   return result.secure_url;
// };

// export const deleteImage = async (publicId) => {
//   await cloudinary.uploader.destroy(publicId);
// };

