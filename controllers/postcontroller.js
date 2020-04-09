require('dotenv').config();
const express = require("express");
const router = express.Router();
const Post = require("../db").import("../models/post");

//IMAGE UPLOADING
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');

const s3 = new aws.S3

//CONNECT TO AWS ACCOUNT
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'us-east-2'
});

//CONNECTS TO AWS ACCOUNT AND MULTER TO UPLOAD SINGLE FILES
const imgUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
        }
    })
})
// limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
// fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
// }


//CHECKS FILE TYPES AND LIMITS THEM TO PICTURE FILES
// function checkFileType(file, cb) {
//     // Allowed ext
//     const filetypes = /jpeg|jpg|png|gif/;
//     // Check ext
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     // Check mime
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Images Only!');
//     }
// }

//CREATE POST
router.post("/create", imgUpload.single('image'), (req, res) => {
  console.log(req.body);
  const postFromRequest = {
    description: req.body.description,
    postUrl: req.file.location, //SAVES AWS FILE URL TO POSTURL 
    userId: req.user.id,
    username: req.user.username
  };
  Post.create(postFromRequest)
    .then(post => res.status(200).json(post))
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//GET ALL POSTS FROM ALL USERS
router.get("/find/feed", (req, res) => {
  Post.findAll()

    .then(post => res.status(200).json(post))
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//GET ALL POSTS FOR USER
router.get("/find", (req, res) => {
  User.findOne({
    where: {
      id: req.user.id
    },
    include: ["posts"]
  })
    .then(post => res.status(200).json(post))
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//EDIT POSTS BY ID
router.put("/edit/:id", (req, res) => {
  Post.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(post => res.status(200).json(post))
    .catch(err => res.json(req.errors));
});

//DELETE POSTS BY ID
router.delete("/delete/:id", (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(post => res.status(200).json(post))
    .catch(err =>
      res.json({
        error: err
      })
    );
});

module.exports = router;