import passport from "passport";
import { Strategy } from "passport-discord";
import User, { IUser } from "../models/User";

const getAvatarUrl = (uid: string, hash: string) =>
  `https://cdn.discordapp.com/avatars/${uid}/${hash}.png`;

export default function passportConfig() {
  // Convert the user database model to an id for passport
  passport.serializeUser((user, done) => {
    done(null, (user as IUser)._id);
  });

  // Convert the id back to a user database model
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new Strategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID || "",
        clientSecret: process.env.DISCORD_SECRET_TOKEN || "",
        callbackURL: process.env.DISCORD_CALLBACK_URL || "",
        scope: ["identify"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ discordId: profile.id });
          if (user) {
            return done(null, user);
          }
          const avatarUrl = profile.avatar
            ? getAvatarUrl(profile.id, profile.avatar)
            : "/logo.png";
          const newUser = new User({
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            avatar: avatarUrl,
          });
          await newUser.save();
          return done(null, newUser);
        } catch (err: any) {
          return done(err);
        }
      }
    )
  );
}
