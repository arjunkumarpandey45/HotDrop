import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/userModel.js";
import "dotenv/config";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;
        const name = profile.displayName || "User";

        if (!email) {
          return done(
            new Error("Google account does not have an email"),
            null
          );
        }

        // 🔍 Existing user check
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // 🔹 Generate unique hotdropId 
        const baseId = email.split("@")[0];
        let hotdropId;
        let exists = true;

        while (exists) {
          hotdropId = `${baseId}${Math.floor(1000 + Math.random() * 9000)}`;
          exists = await User.exists({ hotdropId });
        }

        //  Create new user
        user = await User.create({
          googleId: profile.id,
          username: name,
          email,
          profilePicture: photo || null,
          hotdropId,
          isVerified: true,
          provider: "google"
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
