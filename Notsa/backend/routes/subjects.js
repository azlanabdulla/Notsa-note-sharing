const router = require('express').Router();
const auth = require('../middleware/auth');
const Subject = require('../models/subject.model');
const Note = require('../models/note.model');
const fs = require('fs');
const path = require('path');

router.get('/', auth, async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ name: 1 });
        res.json(subjects);
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const newSubject = new Subject({ name, creator: req.user.id });
        const savedSubject = await newSubject.save();
        res.status(201).json(savedSubject);
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ msg: 'Subject not found' });
        if (subject.creator.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
        const notesToDelete = await Note.find({ subject: req.params.id });
        notesToDelete.forEach(note => {
            const filePath = path.join(__dirname, '..', note.fileUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
        await Note.deleteMany({ subject: req.params.id });
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Subject deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;