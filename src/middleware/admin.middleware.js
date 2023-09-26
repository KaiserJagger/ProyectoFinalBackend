export const isAdmin = (req, res, next) => {
    const user = req.user;
    let isAdminUser = false;
  
    if (user.role == "admin") {
      isAdminUser = true;
      next();
    } else {
      res.status(403).render("errors/accessDeniedErr", {
        message: "Access Denied",
      });
    }
  };