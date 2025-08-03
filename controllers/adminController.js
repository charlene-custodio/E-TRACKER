// Correctly export the function by name
export function showAdminDashboard(req, res) {
  res.render("admin_dashboard", {
    user: {
      username: req.session.username,
      full_name: req.session.full_name,
      role: req.session.role,
    },
  });
}