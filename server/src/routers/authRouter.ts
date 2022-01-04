import { Router } from "express";
import passport from "passport";
import secrets from "../config/secrets";

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
  res.redirect(secrets.CLIENT_URL);
});

authRouter.get(
  "/callback",
  passport.authenticate("discord", {
    failureRedirect: "/auth/login",
    successRedirect: secrets.CLIENT_URL,
  })
);

export default authRouter;
