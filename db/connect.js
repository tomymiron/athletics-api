import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

export const db = mysql.createPool({
  host: "127.0.0.1",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "athletics",
  dateStrings: true,
  multipleStatements: true,
  connectionLimit: 10,
});

const connect = () => {
  db.getConnection((err) => {
    if (err) {
      console.log("Ocurrio un error en la conexion con la base de datos");
    } else {
      console.log("Conexion a MySql Establecida");
    }
  });
};
connect();

export async function queryDatabase(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

db.on("error", (err) => {
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    connect();
  } else {
    throw err;
  }
});