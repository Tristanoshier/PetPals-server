require('dotenv').config();
const router = require('express').Router();
const Pet = require('../db').import('../models/pet');

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

//CREATE PET
router.post('/create', imgUpload.single('image'), (req, res) => {
    const petFromRequest = {
        name: req.body.name,
        animal: req.body.animal,
        bio: req.body.bio,
        adoption: req.body.adoption,
        petPicUrl: req.file.location, //SAVES AWS FILE URL TO POSTURL
        userId: req.user.id
    }
    Pet.create(petFromRequest)
        .then(petInfo => res.status(200).json(petInfo))
        .catch(err => res.json({ error: err }))
})

//GET ALL PET
router.get("/find/feed", (req, res) => {
    Pet.findAll()
        .then(petInfo => res.status(500).json(petInfo))
        .catch(err =>
            res.status(500).json({
                error: err
            })
        );
});

//GET SPECIFIC PET
router.get("/find", (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        },
        include: ["pets"]
    })
        .then(petInfo => res.status(200).json(petInfo))
        .catch(err =>
            res.status(500).json({
                error: err
            })
        );
});

//UPDATE PET
router.put('/update/:id', function (req, res) {
    Pet.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(petInfo => res.status(200).json(petInfo))
        .catch(err => res.json(req.errors))
})

//UPDATE PETS PROFILE PICTURE
router.put("/update/pet-pic/:id", imgUpload.single('image'), (req, res) => {
    Pet.findOne({
        where: {
            id: req.params.id
        }
    }).then(pet => {
        pet.update({
            petPicUrl: req.file.location
        })
    }).then(petPic => res.status(200).json(petPic))
    .catch(err => res.status(500).json(err))
})

//DELETE PET
router.delete('/delete/:id', (req, res) => {
    Pet.destroy({
        where: { id: req.params.id }
    })
        .then(petInfo => res.status(200).json(petInfo))
        .catch(err => res.json({
            error: err
        }))
});

module.exports = router;