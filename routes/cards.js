const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Card = require('../models/Card');
const List = require('../models/List');

const router = express.Router();

// Get cards for a list
router.get('/:listId', authMiddleware, async (req, res) => {
    try {
        const cards = await Card.find({ list: req.params.listId });
        res.send(cards);
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

// Create a new card
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, listId } = req.body;

    try {
        const card = new Card({ title, description, list: listId });
        await card.save();

        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).send({ message: 'List not found' });
        }

        list.cards.push(card._id);  // Make sure to push the card's _id
        await list.save();

        res.status(200).send({ message: "Card created successfully", card });
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

// Get a specific card
router.get('/card/:id', authMiddleware, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).send({ message: 'Card not found' });
        }
        res.send(card);
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

// Update a card
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description } = req.body;

    try {
        const card = await Card.findById(req.params.id);

        if (!card) {
            return res.status(404).send({ message: 'Card not found' });
        }

        if (title) card.title = title;
        if (description) card.description = description;

        await card.save();
        res.send(card);
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

// Delete a card
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);

        if (!card) {
            return res.status(404).send({ message: 'Card not found' });
        }

        await Card.findByIdAndDelete(req.params.id);
        res.send({ message: 'Card removed' });
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
