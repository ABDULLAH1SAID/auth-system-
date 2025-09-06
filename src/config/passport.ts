// passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../dB/models/user.model';

// ===================== Google OAuth =====================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1️⃣ المستخدم موجود بالفعل بـ Google ID
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        // 2️⃣ المستخدم موجود بالبريد الإلكتروني
        const userWithSameEmail = await User.findOne({ email: profile.emails?.[0].value });
        if (userWithSameEmail) {
          userWithSameEmail.googleId = profile.id;
          userWithSameEmail.avatar = profile.photos?.[0].value;
          await userWithSameEmail.save();
          return done(null, userWithSameEmail);
        }

        // 3️⃣ إنشاء مستخدم جديد
        const newUser = await User.create({
          googleId: profile.id,
          firstName: profile.name?.givenName || 'Unknown',
          lastName: profile.name?.familyName || 'Unknown',
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// ===================== GitHub OAuth =====================
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        let existingUser = await User.findOne({ githubId: profile.id });
        if (existingUser) return done(null, existingUser);

        const userWithSameEmail = await User.findOne({ email: profile.emails?.[0].value });
        if (userWithSameEmail) {
          userWithSameEmail.githubId = profile.id;
          userWithSameEmail.avatar = profile.photos?.[0].value;
          await userWithSameEmail.save();
          return done(null, userWithSameEmail);
        }

        const newUser = await User.create({
          githubId: profile.id,
          firstName: profile.name?.givenName || "Unknown",
          lastName: profile.name?.familyName || "Unknown",
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);


export default passport;
