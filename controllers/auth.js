import { db } from "../db/connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// REGISTER POST
export const register = (req, res) => {
  try {
      const { username, email, pass} = req.body.newUser;

      if(!username || !email || !pass) return res.status(400).json("Ocurrio un error, los datos no fueron validos");

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(pass, salt);

      const q = "call new_user(?, ?, ?, ?);";
      const values = [username, email, hashedPassword, pass];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json("Ocurrio un error");
        return res.status(200).json("Usuario creado exitosamente");
      });
  } catch (err) {
    return res.status(400).json("Ocurrió un error");
  }
};

// LOGIN POST
export const login = (req, res) => {
    const {user, pass} = req.body.user;
  if (user == "" || pass == "") return res.status(400).json("Completa los campos!");

  const q = "SELECT * FROM users WHERE `username` = ? OR `email` = ?";
  db.query(q, [user, user], (err, data) => {
      if(err) return res.status(500).json(err);
      if(data.length == 0 || data == null) return res.status(400).json("Usuario no encontrado!");

      const checkPassword = bcrypt.compareSync(pass, data[0].password);
      if(!checkPassword) return res.status(400).json("Contraseña o usuario incorrectos!");

      const token = jwt.sign({ id: data[0].id }, process.env.SECRET_KEY);
      let {password, ...user} = data[0];

      res.status(200).json({token: token, user: user});
  });
};