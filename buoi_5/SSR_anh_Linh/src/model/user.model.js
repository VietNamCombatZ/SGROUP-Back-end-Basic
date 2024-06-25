import pool from '../database/database.config'

class UserModel {
    constructor(id, name, gender, username, age, password, email, salt, forgetPasswordToken, forgetPasswordTokenExpiration) {
        this.ID = id;
        this.NAME = name;
        this.USERNAME = username;
        this.AGE = age;
        this.PASSWORD = password;
        this.EMAIL = email;
        this.SALT = salt;
        this.GENDER = gender; // Đã sửa thành this.gender
        this.FORGET_PASSWORD_TOKEN = forgetPasswordToken;
        this.forgetPasswordTokenExpiration = forgetPasswordTokenExpiration;
    }

    async getAllUsers() {
        try {
            const connection = await pool.getConnection();
            const [rows, fields] = await connection.query('SELECT * FROM USERS');
            connection.release();
            return rows;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }
    async getUserById(id) {
        try {
            const connection = await pool.getConnection();
            const [rows, fields] = await connection.query('SELECT * FROM USERS WHERE ID = ?', [id]);
            connection.release();
            return rows[0];
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }
    async createUser(user) {
        try {
            const connection = await pool.getConnection();
            const query = `
                INSERT INTO USERS (name, gender, username, age, password, email, salt, FORGET_PASSWORD_TOKEN)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const { name, gender, username, age, password, email, salt, forgetPasswordToken, forgetPasswordTokenExpiration } = user;
            const values = [name, gender, username, age, password, email, salt, forgetPasswordToken];
            await connection.query(query, values);
            connection.release();
            return { success: true, message: 'User created successfully' };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }
    async getUserByUsername(username) {
        try {
            const connection = await pool.getConnection();
            const [rows, fields] = await connection.query('SELECT * FROM USERS WHERE USERNAME = ?', [username]);
            connection.release();
            return rows[0];
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

}

export default UserModel;
