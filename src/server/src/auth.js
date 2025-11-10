const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_INACTIVITY_MS = 30 * 60 * 1000;

const activeTokens = new Map(); // token -> { userId, role, lastSeen }

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === testHash;

}

function issueToken(user) {
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '30m' }
  );
  activeTokens.set(token, {
    userId: user.id,
    role: user.role,
    lastSeen: Date.now()
  });
  return token;
}

function verifyTokenRaw(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const entry = activeTokens.get(token);
    if (!entry || entry.userId !== payload.sub) return null;

    const now = Date.now();
    if (now - entry.lastSeen > TOKEN_INACTIVITY_MS) {
      activeTokens.delete(token);
      return null;
    }

    entry.lastSeen = now;
    return { id: entry.userId, role: entry.role };
  } catch {
    return null;
  }
}

function logoutToken(token) {
  activeTokens.delete(token);
}

module.exports = {
  hashPassword,
  verifyPassword,
  issueToken,
  verifyTokenRaw,
  logoutToken
};
