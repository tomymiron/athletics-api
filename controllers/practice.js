import { queryDatabase } from "../db/connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// SYNC POST
export const attemptsSync = (req, res) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json("Usuario no valido")
    const { attempts } = req.body;
    if(attempts?.length < 1) return res.status(400).json("Ningun intento obtenido");

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if(err) return res.status(403).json("Token no valido");

        console.log(attempts)
        try {
            for (let attempt of attempts) await queryDatabase("call sync_attempt(?, ?, ?)", [userInfo.id, attempt.time, attempt.date]);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ success: false });
        }
    });
};

// SYNC GET
export const attemptsGetter = (req, res) => {
    const token = req.headers['authorization'];
    console.log("HOLA?", token)
    if(!token) return res.status(401).json("Usuario no valido")
    const { lastSyncedAt } = req.query;

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if(err) return res.status(403).json("Token no valido");
        const lastSyncedAtFormatted = lastSyncedAt ? lastSyncedAt.replace("T", " ").slice(0,19) : null
        console.log("FECHA OBTENIDA: ", lastSyncedAtFormatted, "USER: ", userInfo.id)

        try {
            const data = await queryDatabase("call getter_attempt(?, ?)", [userInfo.id, lastSyncedAtFormatted != null ? lastSyncedAtFormatted : '1970-01-01 00:00:00']);
            console.log(data[0], lastSyncedAtFormatted)
            return res.status(200).json({ attempts: data[0]});
        } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ attempts: null});
        }
    });
};