import express from 'express';
import { UserRoute } from './users/index.js';
import { authRoute } from './auth/index.js';

const router = express.Router();

router.use('/users', UserRoute);
router.use('/auth', authRoute);


export default router;