const jwt = require('jsonwebtoken');

function secret() {
  return process.env.JWT_SECRET || 'dayflow-dev-secret-change-me';
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({message:'Authentication required'});
  try {
    req.user = jwt.verify(token, secret());
    next();
  } catch {
    return res.status(401).json({message:'Invalid or expired token'});
  }
}

function requireRole(...roles) {
  return (req,res,next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({message:'Access denied'});
    }
    next();
  };
}

module.exports = { authenticate, requireRole, secret };
