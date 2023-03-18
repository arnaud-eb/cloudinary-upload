const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('./config');

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

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Uploading images to Cloudinary Console',
  });
});

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({
      msg: 'No files were uploaded. Try uploading an image',
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
    res.render('media', {
      img: result.url,
      name: uploadFile.name.replace(/.jpeg|.jpg|.png|.webp/gi, ''),
    });
  }
  else {
    res.render('/upload');
  }
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
