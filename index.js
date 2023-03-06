const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

// dotenv
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use('/', express.static(path.join(__dirname, 'public')));
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
  res.render('index', {
    title: 'Uploading images to Cloudinary Console',
  });
});

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({
      msg: 'No files were uploaded.',
    });
    return;
  }

  const uploadFile = req.files.uploadFile;

  const result = await cloudinary.uploader.upload(uploadFile.tempFilePath, {
    public_id: uploadFile.name,
    resource_type: 'auto',
    folder: 'uploaded',
    use_filename: true,
    unique_filename: false,
  });

  if (result.url) {
    res.render('photo', {
      img: result.url,
      name: uploadFile.name.replace(/.jpeg|.jpg|.png|.mp4|.mov|.mp3/gi, ''),
    });
  } else {
    res.render('/');
  }
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
