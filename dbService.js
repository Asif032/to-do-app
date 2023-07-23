const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

connection.connect((error) => {
  if (error) {
    console.log(error.message);
  }
  // console.log('db ' + connection.state);
});


class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM todolist;";

        connection.query(query, (error, results) => {
          if (error) reject(new Error(error.message));
          resolve(results);
        })
      });
      // console.log(response);
      return response;
    } catch (error) {
       console.log(error);
    }
  }


  async insertNewTask(task) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO todolist (task, date_added) VALUES (?,?);";

          connection.query(query, [task, dateAdded] , (error, result) => {
            if (error) reject(new Error(error.message));
            resolve(result.insertId);
          })
      });
      return {
        id : insertId,
        task : task,
        dateAdded : dateAdded
      };
    } catch (error) {
        console.log(error);
    }
  }

  async deleteRowById(id) {f
      try {
        id = parseInt(id, 10); 
        const response = await new Promise((resolve, reject) => {
          const query = "DELETE FROM todolist WHERE id = ?";

          connection.query(query, [id] , (error, result) => {
            if (error) reject(new Error(error.message));
            resolve(result.affectedRows);
          })
        });

        return response === 1 ? true : false;
      } catch (error) {
        console.log(error);
        return false;
      }
  }

  async updateTaskById(id, task) {
      try {
        id = parseInt(id, 10); 
        const response = await new Promise((resolve, reject) => {
          const query = "UPDATE todolist SET task = ? WHERE id = ?";

          connection.query(query, [task, id] , (error, result) => {
              if (error) reject(new Error(error.message));
              resolve(result.affectedRows);
          })
        });

        return response === 1 ? true : false;
      } catch (error) {
        console.log(error);
        return false;
      }
  }

  async searchByTaskName(task) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM todolist WHERE task = ?;";

        connection.query(query, [task], (error, results) => {
          if (error) reject(new Error(error.message));
          resolve(results);
        })
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;