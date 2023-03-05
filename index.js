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
  let uploadFile;
  // let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  // console.log('req.files >>>', req.files);

  uploadFile = req.files.uploadFile;
  const result = await cloudinary.uploader.upload(uploadFile.tempFilePath, {
    public_id: uploadFile.name,
    resource_type: 'auto',
    folder: 'uploaded',
    use_filename: true,
    unique_filename: false,
  });

  uploadFile.mv(result, function (err) {
    // if (err) {
    //   return res.status(500).send(err);
    // }

    // res.send('File successfully uploaded', uploadFile.name);
    console.log(result.url);
  });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
