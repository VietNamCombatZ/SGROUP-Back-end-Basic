import express from 'express';
import AuthController from './auth.controller.js';
// import ValidationMiddleware from '../../middlewares/Validation.middleware.js';
// import authBodyValidateRules from './dto/auth-body.rules.js';
// import AuthorizationMiddleware from '../../middlewares/Authorization.middleware.js';

const router = express.Router();

router
    .post('/login', AuthController.login)
    .post('/register', AuthController.register)
    .post('/forgot-password', AuthController.forgotPassword)
    .post('/reset-password', AuthController.resetPassword)

export default router;