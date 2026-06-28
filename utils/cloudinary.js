const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(fileBuffer, mimetype) {
  const b64 = fileBuffer.toString('base64');
  const dataURI = `data:${mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'chapter-and-verse/books',
  });
  return result.secure_url;
}

module.exports = { uploadImage };
