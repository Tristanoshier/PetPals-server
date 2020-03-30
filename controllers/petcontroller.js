const router = require('express').Router();
const Pet = require('../db').import('../models/pet');

//CREATE PET
router.post('/create', function (req, res) {
    const petFromRequest = {
        name: req.pet.name,
        animal: req.pet.animal,
        bio: req.pet.bio,
        adoption: req.pet.adoption,
        petPicUrl: req.pet.petPicUrl,
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
    Pet.findOne({
        where: {
            id: req.user.id
        },
        include: [pets]
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