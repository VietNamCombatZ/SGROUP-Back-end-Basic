import AuthService from './auth.service.js';
import userService from '../users/user.service.js';
class AuthController {
    login = async (req, res, next) => {
        const { username, password } = req.body;
        const token = await AuthService.login({ username, password });
        if (token == null) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        return res.status(200).json({ token });
    }
    register = async (req, res, next) => {
        let newUser = {
            name: req.body.name,
            gender: req.body.gender,
            age: req.body.age,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };
         await userService.create(newUser);
        return res.status(201).json(newUser);
    }
    forgotPassword = async (req, res, next) => {
        const { email } = req.body;
        const token = await AuthService.forgotPassword(email);
        if (token == null) {
            return res.status(404).json({ message: 'Email not found.' });
        }
        return res.status(200).json({ token });
    }
    resetPassword = async (req, res, next) => {
        const { token, newPassword } = req.body;
        const user = await AuthService.resetPassword(token, newPassword);
        if (user == null) {
            return res.status(404).json({ message: 'Token not found.' });
        }
        return res.status(200).json(user);
    }
}

export default new AuthController();