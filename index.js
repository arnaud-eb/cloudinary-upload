const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

// dotenv
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express();

// middleware
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.get('/', (req, res) => {
  res.send('it is working!!!');
});

app.post('/', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.image;

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    public_id: file.name,
    resource_type: 'auto',
    folder: 'uploaded',
  });
  console.log(file);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
