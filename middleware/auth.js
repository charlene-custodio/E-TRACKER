// Checks if a user is logged in
export function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/login');
}

// Checks if logged in user is a tutor
export function requireTutor(req, res, next) {
  if (req.session && req.session.role === "tutor") {
    return next();
  }
  return res.status(403).send("Forbidden: Tutors only");
}

// You can also keep requireAdmin here if you reuse it elsewhere
export function requireAdmin(req, res, next) {
  if (req.session && req.session.role === "admin") {
    return next();
  }
  return res.status(403).send("Forbidden: Admins only");
}