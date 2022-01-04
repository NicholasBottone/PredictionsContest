import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  if (req.user) {
    res.json({
      user: req.user,
      success: true,
    });
  } else {
    res.json({
      success: false,
    });
  }
});

authRouter.get(
  "/login",
  passport.authenticate("discord", { scope: ["identify"], prompt: "consent" })
);

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL || "");
});

authRouter.get(
  "/callback",
  passport.authenticate("discord", {
    failureRedirect: "/auth/login",
    successRedirect: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

export default authRouter;
