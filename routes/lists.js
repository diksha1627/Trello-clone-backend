const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const List = require('../models/List');

const router = express.Router();

// Get all lists for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Populate card titles
        const lists = await List.find({ user: req.user.id })
            .populate({
                path: 'cards',
                 select: 'title createdAt '// Fetch only the title of each card
            });

        res.send(lists);
    } catch (err) {
        console.error('Error fetching lists:', err);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

// Create a new list
router.post('/', authMiddleware, async (req, res) => {
    const { title } = req.body;

    try {
        const list = new List({ title, user: req.user.id });
        await list.save();
        res.send(list);
    } catch (err) {
        console.error('Error creating list:', err);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

// Delete a list
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const list = await List.findByIdAndDelete(req.params.id);

        if (!list) {
            return res.status(404).send({ message: 'List not found' });
        }

        if (list.user.toString() !== req.user.id) {
            return res.status(401).send({ message: 'User not authorized' });
        }

        res.send({ message: 'List removed' });
    } catch (err) {
        console.error('Error deleting list:', err);
        res.status(500).send({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
