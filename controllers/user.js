import { queryDatabase } from "../db/connect.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// USERNAME CHECK GET
export const usernameCheck = async (req, res) => {
    const { username } = req.query;
    if(!username) return res.status(400).json("Ningun username obtenido");
    const newUsername = username.toLowerCase();

    try {
        const data = await queryDatabase("call users_username_check(?)", [newUsername]);
        return res.status(200).json({ inUse: data[0].length > 0 });
    } catch (err) {
        console.log("ERROR:", err);
        return res.status(500).json({ success: false });
    }
};

// EMAIL CHECK GET
export const emailCheck = async (req, res) => {
    const { email } = req.query;
    if(!email) return res.status(400).json("Ningun email obtenido");
    const newEmail = email.toLowerCase();

    async function isEmailValid(email){
        return validator.isEmail(email)
    }
    const emailValidation = await isEmailValid(newEmail);
    if(!emailValidation) return res.status(400).json("El email ingresado no es valido");

    try {
        const data = await queryDatabase("call users_email_check(?)", [newEmail]);
        return res.status(200).json({ inUse: data[0].length > 0 });
    } catch (err) {
        console.log("ERROR:", err);
        return res.status(500).json({ success: false });
    }
};

// USERNAME POST
export const usernameChange = (req, res) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json("Usuario no valido")
    const { username } = req.body;
    if(!username) return res.status(400).json("Ningun username obtenido");

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if(err) return res.status(403).json("Token no valido");

        try {
            const data = await queryDatabase("call users_username_change(?, ?)", [userInfo.id, username]);
            return res.status(200).json({ success: data[0][0].msg == 1 ? true : false });
        } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ success: false });
        }
    });
};