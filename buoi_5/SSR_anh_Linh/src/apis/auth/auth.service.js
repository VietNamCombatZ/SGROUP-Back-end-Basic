import Database from '../../database/query';
import UserModel from '../../model/user.model';
import { hashPassword,hashPasswordSalt } from '../../service';
import { UserIdentityService } from '../../service'
class AuthService {
    constructor() {
        this.db = new Database();
        this.userModel = new UserModel();
        this.userIdentityService = new UserIdentityService();
    }

    // async getAll(username) {
    //     try {
    //         const users = await this.db.select('SELECT * FROM USERS');
    //         return users;
    //     } catch (error) {
    //         console.error('Error fetching all USERS:', error);
    //         throw error;
    //     }
    // }

    // async getUserWithPaging(page, size, username) {
    //     try {
    //         const query = `
    //             SELECT *
    //             FROM USERS
    //             WHERE USERNAME LIKE ?
    //             LIMIT ?
    //             OFFSET ?
    //         `;
    //         const params = [`%${username ?? ''}%`, size, (page - 1) * size];
    //         const users = await this.db.select(query, params);
    //         return users;
    //     } catch (error) {
    //         console.error('Error fetching users with paging:', error);
    //         throw error;
    //     }
    // }

    // async getById(id) {
    //     try {
    //         const query = 'SELECT * FROM users WHERE ID = ?';
    //         const user = await this.db.select(query, [id]);
    //         return user[0];
    //     } catch (error) {
    //         console.error(`Error fetching user with ID ${id}:`, error);
    //         throw error;
    //     }
    // }

    // async create(user) {
    //     try {
    //         const query = `
    //             INSERT INTO users (NAME, AGE, GENDER, PASSWORD, CREATEDBY)
    //             VALUES (?, ?, ?, ?, ?)
    //         `;
    //         const params = [user.fullname, user.age, user.gender, user.password, user.createdBy];
    //         const id = await this.db.insert(query, params);
    //         user.id = id;
    //         return user;
    //     } catch (error) {
    //         console.error('Error creating user:', error);
    //         throw error;
    //     }
    // }

    // async update(id, user) {
    //     try {
    //         const query = `
    //             UPDATE users
    //             SET NAME = ?, AGE = ?, GENDER = ?, PASSWORD = ?
    //             WHERE ID = ?
    //         `;
    //         const params = [user.fullname, user.age, user.gender, user.password, id];
    //         await this.db.update(query, params);
    //     } catch (error) {
    //         console.error(`Error updating user with ID ${id}:`, error);
    //         throw error;
    //     }
    // }

    // async removeById(id) {
    //     try {
    //         const query = 'DELETE FROM users WHERE ID = ?';
    //         await this.db.delete(query, [id]);
    //     } catch (error) {
    //         console.error(`Error deleting user with ID ${id}:`, error);
    //         throw error;
    //     }
    // }
    async login(loginDTO) {
        try {
            const user = await this.userModel.getUserByUsername(loginDTO.username);
            if (user == null) {
                return new Error('User not found');
            }
            const password = await hashPasswordSalt(user.SALT, loginDTO.password);
            if (password !== user.PASSWORD) {
                console.log('vao day password');
                return new Error('Invalid password');
            }
            console.log('vao day1');
            const token = await this.userIdentityService.sign(user);
            return token;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

export default new AuthService();
