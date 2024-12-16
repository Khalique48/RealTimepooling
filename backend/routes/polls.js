import express from 'express';
import Poll from '../models/Poll.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new poll
router.post('/', auth, async (req, res) => {
    try {
        const { question, options } = req.body;
        const poll = new Poll({
            question,
            options: options.map(option => ({ text: option, votes: 0 })),
            createdBy: req.user.userId,
        });
        await poll.save();
        res.status(201).json(poll);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all polls
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Vote on a poll
router.get('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        res.json(poll);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/:id/vote', auth, async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        poll.options[optionIndex].votes += 1;
        await poll.save();
        res.json(poll);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

