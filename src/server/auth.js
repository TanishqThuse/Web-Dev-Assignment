const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'tempsecret';

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const newHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === newHash;
}
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '30m' });
}
module.exports = { hashPassword, verifyPassword, generateToken, SECRET };
