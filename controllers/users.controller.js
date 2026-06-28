const User = require('../models/users');
const BlacklistedToken = require('../models/blacklistedTokens');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/sendEmail');

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_URL}/auth/google/callback`
);

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  provider: user.provider,
});

// Register with credentials
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).send({ success: false, message: 'Email is already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      provider: 'local',
      verificationToken,
      verificationTokenExpiry,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).send({ success: true, message: 'Registration successful. Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ success: false, message: 'No account found with this email.' });
    if (user.isVerified) return res.status(400).send({ success: false, message: 'This account is already verified.' });

    user.verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.verificationToken);

    res.send({ success: true, message: 'Verification email resent. Please check your inbox.' });
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

    if (!user) return res.status(400).send({ success: false, message: 'Invalid or expired verification link.' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.send({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Login with credentials
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send({ success: false, message: 'Invalid email or password.' });

    if (user.provider === 'google') {
      return res.status(403).send({ success: false, message: 'This account uses Google sign-in. Please continue with Google.' });
    }

    if (!user.isVerified) {
      return res.status(403).send({ success: false, message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ success: false, message: 'Invalid email or password.' });

    res.send({ success: true, message: 'Login successful.', token: signToken(user), user: safeUser(user) });
  } catch (error) {
    res.status(500).send(error);
  }
};

// POST /auth/google — verifies Google ID token credential from frontend (@react-oauth/google)
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        provider: 'google',
        isVerified: true,
      });
    } else if (user.provider === 'local') {
      return res.status(409).send({ success: false, message: 'This email is already registered with credentials. Please log in with email and password.' });
    }

    res.send({ success: true, message: 'Google sign-in successful.', token: signToken(user), user: safeUser(user) });
  } catch (error) {
    res.status(401).send({ success: false, message: 'Invalid Google credential.' });
  }
};

// Step 1: Redirect user to Google consent screen
exports.googleAuthRedirect = (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'select_account',
  });
  res.redirect(url);
};

// Step 2: Google redirects here with auth code — exchange it for user info
exports.googleAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await googleClient.getToken(code);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        provider: 'google',
        isVerified: true,
      });
    } else if (user.provider === 'local') {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=email_exists`);
    }

    const token = signToken(user);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    await BlacklistedToken.create({ token, expiresAt: new Date(decoded.exp * 1000) });
    res.send({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Silent login — verify stored token (ignoring expiry) and return a fresh one
exports.refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ success: false, message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) return res.status(401).send({ success: false, message: 'Token has been invalidated. Please log in again.' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    } catch {
      return res.status(401).send({ success: false, message: 'Invalid token.' });
    }

    const user = await User.findById(decoded.id, { password: 0, verificationToken: 0, verificationTokenExpiry: 0 });
    if (!user) return res.status(404).send({ success: false, message: 'User not found.' });

    res.send({ success: true, message: 'Token refreshed.', token: signToken(user), user: safeUser(user) });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get current logged-in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, { password: 0, verificationToken: 0, verificationTokenExpiry: 0 });
    if (!user) return res.status(404).send({ message: 'User not found.' });
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phoneNumber, address },
      { new: true, projection: { password: 0, verificationToken: 0, verificationTokenExpiry: 0 } }
    );
    res.send({ success: true, message: 'Profile updated successfully.', data: user });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Make user an admin
exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true, projection: { password: 0, verificationToken: 0, verificationTokenExpiry: 0 } }
    );
    if (!user) return res.status(404).send({ success: false, message: 'User not found.' });
    res.send({ success: true, message: 'User is now an admin.', data: user });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Remove admin role
exports.removeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'user' },
      { new: true, projection: { password: 0, verificationToken: 0, verificationTokenExpiry: 0 } }
    );
    if (!user) return res.status(404).send({ success: false, message: 'User not found.' });
    res.send({ success: true, message: 'Admin role removed successfully.', data: user });
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

// Forgot password — generate token and send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Return success to avoid revealing whether the email exists
      return res.send({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    if (user.provider === 'google') {
      return res.status(400).send({ success: false, message: 'This account uses Google sign-in. No password to reset.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.send({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Reset password — validate token and set new password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).send({ success: false, message: 'Invalid or expired reset link.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    res.send({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).send(error);
  }
};
