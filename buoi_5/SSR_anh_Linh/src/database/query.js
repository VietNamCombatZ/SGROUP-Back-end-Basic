import pool from "./database.config";


class Database {
  async select(query, params = []) {
    try {UserIdentityService
      const [rows, fields] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error executing select query:', error);
      throw error;
    }
  }

  async insert(table, data) {
    try {
      const result = await pool.query(`INSERT INTO ${table} SET ?`, [data]);
      return result.insertId;
    } catch (error) {
      console.error(`Error executing insert query for table ${table}:`, error);
      throw error;
    }
  }

  async update(table, data, condition, conditionParams = []) {
    try {
      const result = await pool.query(`UPDATE ${table} SET ? WHERE ${condition}`, [data, ...conditionParams]);
      return result.affectedRows;
    } catch (error) {
      console.error(`Error executing update query for table ${table}:`, error);
      throw error;
    }
  }

  async delete(table, condition, conditionParams = []) {
    try {
      const result = await pool.query(`DELETE FROM ${table} WHERE ${condition}`, conditionParams);
      return result.affectedRows;
    } catch (error) {
      console.error(`Error executing delete query for table ${table}:`, error);
      throw error;
    }
  }
}

export default Database;

