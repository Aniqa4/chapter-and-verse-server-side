const mongoose = require('mongoose');

const blacklistedTokensSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

blacklistedTokensSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BlacklistedToken = mongoose.model('blacklistedtokens', blacklistedTokensSchema);
module.exports = BlacklistedToken;
