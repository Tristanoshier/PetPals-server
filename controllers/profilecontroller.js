require("dotenv").config();
//get profile info

//update profile info
const Profile = require("../db").import("../models/user");

//image uploading
const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  Bucket: process.env.BUCKET_NAME
});

//CONNECTS TO AWS ACCOUNT AND MULTER TO UPLOAD SINGLE FILES
const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    key: function(req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    }
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("profileImage");

//CHECKS FILE TYPES AND LIMITS THEM TO PICTURE FILES
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.post("/profile-img-upload", (req, res) => {
  profileImgUpload(req, res, error => {
    // console.log( 'requestOkokok', req.file );
    // console.log( 'error', error );
    if (error) {
      console.log("errors", error);
      res.json({ error: error });
    } else {
      // If File not found
      if (req.file === undefined) {
        console.log("Error: No File Selected!");
        res.json("Error: No File Selected");
      } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location; // Save the file name into database into profile model
        res.json({
          image: imageName,
          location: imageLocation
        });
      }
    }
  });
});

// router.put('/update-profile-photo', upload.single('image'), (req, res) => {
//     User.findOne({
//         where: {
//             id: req.user.id
//         }
//     })
//         .then(foundUser => {
//             foundUser.update({
//                 profilePicUrl: req.file.location
//             },
//                 {
//                     returning: true
//                 })
//                 .then(updated => res.status(200).json(updated))
//                 .catch(err => res.status(500).json(err))
//         })
//         .catch(err => res.status(500).json(err))
// })

//GET SPECIFIC PROFILE OF USER
router.get("/find", (req, res) => {
  Profile.findOne({
    where: {
      id: req.user.id
    }
  })
    .then(profile => res.status(200).json(profile))
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//UPDATE PROFILE
//Already passed most of what the user needs in the auth
router.put("/update/:id", (req, res) => {
  Post.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(profile => res.status(200).json(profile))
    .catch(err => res.json(req.errors));
});

module.exports = router;
