const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


//allows user to sign up for an account
router.post('/signup', (req, res) => {
    User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            adoptionRecruiter: req.body.adoptionRecruiter,
            bio: req.body.bio,
            contact: req.body.contact,
            userType: req.body.userType,
            profileImg: req.body.profileImg
        })
        .then(
            createSuccess = (user) => {
                let token = jwt.sign({
                    id: user.id
                }, process.env.JWT_SECRET, {
                    expiresIn: 60 * 60 * 24
                })
                res.json({
                    user: user,
                    message: 'user created',
                    sessionToken: token
                })
            },
            createError = err => res.send(500, err)
        )
});

//allows user to login to their account
router.post('/login', (req, res) => {
    User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, matches) => {
                    if (matches) {
                        let token = jwt.sign({
                            id: user.id
                        }, process.env.JWT_SECRET, {
                            expiresIn: 60 * 60 * 24
                        })
                        res.json({
                            user: user,
                            message: 'login success',
                            sessionToken: token
                        })
                    } else {
                        res.status(502).send({
                            error: 'bad gateway'
                        })
                    }
                })
            } else {
                res.status(500).send({
                    error: "failed to authenticate"
                })
            }
        }, err => status(501).send({
            error: 'failed to process'
        }))
})

//GET USER INFO FOR PROFILE
router.get('/find', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(profile => res.status(200).json(profile))
        .catch(err =>
            res.status(500).json({
                error: err
            })
        );
});

router.get('/find-all', (req, res) => {
    User.findAll()
    .then(users => res.status(200).json(users))
    .catch(err =>
        res.status(500).json({
            error: err
        }))
})

router.put("/update/:username", (req, res) => {
    User.update(req.body, {
        where: {
            username: req.params.username
        }
    })
        .then(profile => res.status(200).json(profile))
        .catch(err => res.json(req.errors));
})


module.exports = router;