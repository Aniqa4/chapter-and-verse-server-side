const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/sendEmail');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).send({ message: 'Email is already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      role: role === 'admin' ? 'user' : (role || 'user'),
      verificationToken,
      verificationTokenExpiry,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).send({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) return res.status(400).send({ message: 'Invalid or expired verification link.' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.send({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send({ message: 'Invalid email or password.' });

    if (!user.isVerified) {
      return res.status(403).send({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ message: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.send({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all users (admin)
exports.getUsers = async (req, res) => {
  try {
    const result = await User.find({}, { password: 0, verificationToken: 0, verificationTokenExpiry: 0 });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
