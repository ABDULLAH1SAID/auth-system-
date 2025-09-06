import { Router } from 'express'
const router = Router()
import { validation } from '../../middlewares/validation.middleware';
import * as authSchema from './auth.schema'
import * as authController from './auth.controller'
import { isAuthenticated } from '../../middlewares/isAuthenticated.middleware';
import passport from '../../config/passport';
import { session } from 'passport';

 router.post('/register',validation(authSchema.register),authController.register)
 router.post('/login',validation(authSchema.login),authController.login)
 router.post('/refresh-token',validation(authSchema.refreshToken),authController.refreshToken)
 router.patch("/logout",isAuthenticated ,authController.logout)

 // Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google/failure', session: false }),
  authController.googleAuthSuccess
);

router.get('/google/failure', authController.googleAuthFailure);

// GitHub OAuth routes
router.get('/github', 
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/github/failure', session: false }),
  authController.githubAuthSuccess
);

router.get('/github/failure', authController.githubAuthFailure);


export default router;