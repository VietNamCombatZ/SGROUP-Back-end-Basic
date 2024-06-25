import express from 'express';
import UserController from './user.controller.js';
import verify from '../../middleware/verify.middleware';
// import ValidationMiddleware from '../../middlewares/Validation.middleware.js';
// import UserBodyValidateRules from './dto/user-body.rules.js';
// import AuthorizationMiddleware from '../../middlewares/Authorization.middleware.js';

const router = express.Router();

router
    .get('/', UserController.getAllUser)
    .post('/', UserController.createNewUser)
    .get('/:id',verify, UserController.getUserById)
    .delete('/:id', UserController.removeUser)
    .put('/:id', UserController.updateUser);

export default router;