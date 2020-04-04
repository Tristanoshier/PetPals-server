const express = require("express");
const router = express.Router();
const Post = require("../db").import("../models/post");
//desciption, postUrl

//Create Post
router.post("/create", (req, res) => {
  console.log(req.body);
  const postFromRequest = {
    description: req.body.description,
    postUrl: req.body.postUrl,
    userId: req.user.id
  };
  Post.create(postFromRequest)
    .then(post => res.status(200).json(post))

    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//Get all posts
router.get("/find/feed", (req, res) => {
  Post.findAll()

    .then(post => res.status(500).json(post))
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//Get all for user
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

//Edit posts
router.put("/edit/:id", (req, res) => {
  Post.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(post => res.status(200).json(post))
    .catch(err => res.json(req.errors));
});

//Delete posts
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