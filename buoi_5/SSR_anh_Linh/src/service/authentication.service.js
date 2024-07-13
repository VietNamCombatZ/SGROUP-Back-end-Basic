import jwt from 'jsonwebtoken';
// function signJwt(user,roles)
// {   
//     const jwtSecret = process.env.JWT_SECRET;

//     if (!jwtSecret) {
//         throw new Error('JWT secret is not defined. Please set the JWT_SECRET environment variable.');
//     }
//     return jwt.sign(
//         {
//             id: user.id,
//             name: user.name,
//             username: user.username,
//             email: user.email,
//             roles
//         }, jwtSecret, { expiresIn: '1h', algorithm: 'HS256' });
// }

// export { signJwt }
class UserIdentityService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET;
    }

    async sign(user) {
        return jwt.sign({id:user.ID}, this.JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256' });
    }
    verify(token) {
        return jwt.verify(token, this.JWT_SECRET);
    }
    assignUserRequestContext(user,request) {
        request.user = user;
    }
}
export default UserIdentityService;