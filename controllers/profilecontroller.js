const express = require("express");
const router = express.Router();
const Profile = require("../db").import("../models/user")

//GET SPECIFIC PROFILE OF USER
router.get("/find", (req, res) => {
    Profile.findOne({
        where: {
            id: req.user.id
        },
        include: ["profile"]
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
})

module.exports = router;