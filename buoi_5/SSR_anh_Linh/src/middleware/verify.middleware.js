
import jwt from 'jsonwebtoken';
import { UserIdentityService } from '../service';
import env from 'dotenv';
env.config(); 


export default function verify(req , res, next) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token is required.' });
    }
    token = token.split(' ')[1];
    try {
        const userIdentityService = new UserIdentityService();
        const decoded = userIdentityService.verify(token);
        userIdentityService.assignUserRequestContext(decoded,req);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}