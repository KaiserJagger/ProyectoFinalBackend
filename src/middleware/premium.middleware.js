export const isPremium = (req, res, next) => {
  const user = req.user;
  let isPremiumUser = false;

  if (user.role == "premium") {
    isPremiumUser = true;
    next();
  } else {
    res.status(403).render("errors/accessDeniedErr", {
      message: "Access Denied",
    });
  }
};


