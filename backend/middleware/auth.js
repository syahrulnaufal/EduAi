export const verifyUser = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Silakan login dulu" });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Silakan login dulu" });
  }
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Akses khusus admin" });
  }
  next();
};