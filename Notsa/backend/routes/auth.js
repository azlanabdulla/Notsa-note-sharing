const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ msg: "Please enter all fields." });
        if (password.length < 6) return res.status(400).json({ msg: "Password must be at least 6 characters." });
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.status(201).json({ token, user: { id: savedUser.id, username: savedUser.username } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Please enter all fields." });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;