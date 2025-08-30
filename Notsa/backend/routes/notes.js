const router = require('express').Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Note = require('../models/note.model');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('noteFile'), async (req, res) => {
    try {
        const { title, subjectId } = req.body;
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
        const newNote = new Note({ title, fileUrl: `/uploads/${req.file.filename}`, subject: subjectId, uploader: req.user.id });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/:subjectId', auth, async (req, res) => {
    try {
        const notes = await Note.find({ subject: req.params.subjectId }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });
        if (note.uploader.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
        const filePath = path.join(__dirname, '..', note.fileUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await Note.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Note deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;