import pool from './database.config.js';

const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS sgroup`;
const useDatabaseQuery = `USE sgroup`;
const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS USERS (
        ID INT PRIMARY KEY AUTO_INCREMENT,
        GENDER TINYINT,
        NAME VARCHAR(255),
        USERNAME VARCHAR(30),
        AGE INT,
        PASSWORD VARCHAR(255),
        EMAIL NVARCHAR(255),
        SALT VARCHAR(255),
        FORGET_PASSWORD_TOKEN VARCHAR(255),
        FORGET_PASSWORD_TOKEN_EXPIRATION DATETIME,
        CHECK (AGE > 0)
    )`;
const createPollsTableQuery = `
    CREATE TABLE IF NOT EXISTS POLLS (
        ID NVARCHAR(256) PRIMARY KEY,
        NAME NVARCHAR(256),
        DESCRIPTION NVARCHAR(256),
        QUESTION NVARCHAR(256)
    )`;
const createOptionsTableQuery = `
    CREATE TABLE IF NOT EXISTS OPTIONS (
        ID NVARCHAR(256) PRIMARY KEY,
        TITLE NVARCHAR(256),
        POLLID NVARCHAR(256),
        CONSTRAINT fk_poll_option FOREIGN KEY (POLLID) REFERENCES POLLS(ID) ON UPDATE CASCADE ON DELETE CASCADE
    )`;
const createUserOptionsTableQuery = `
    CREATE TABLE IF NOT EXISTS USER_OPTIONS (
        USERID INT,
        OPTIONID NVARCHAR(256),
        PRIMARY KEY(USERID, OPTIONID),
        CONSTRAINT fk_user_option FOREIGN KEY (USERID) REFERENCES USERS(ID) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT fk_option_option FOREIGN KEY (OPTIONID) REFERENCES OPTIONS(ID) ON UPDATE CASCADE ON DELETE CASCADE
    )`;

(async () => {
    const connection = await pool.getConnection();
    try {
        await connection.query(createDatabaseQuery);
        await connection.query(useDatabaseQuery);
        await connection.query(createUsersTableQuery);
        await connection.query(createPollsTableQuery);
        await connection.query(createOptionsTableQuery);
        await connection.query(createUserOptionsTableQuery);
        console.log('Init database successfully!!');
    } catch (error) {
        console.error('Init database failed:', error);
    } finally {
        connection.release();
    }
})();
