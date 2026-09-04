import express from 'express';
import { loginUser, logoutUser, registerUser, getSmsUsers } from '../controllers/loginController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/sms-users', getSmsUsers);

export default router;
