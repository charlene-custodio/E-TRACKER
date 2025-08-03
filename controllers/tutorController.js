export function showDashboard(req, res) {
  res.render("dashboard", { user: { 
    username: req.session.username,
    full_name: req.session.full_name,
    role: req.session.role
  } });
}  