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
    if(!token) return res.status(401).json("Usuario no valido")
    const { lastSyncedAt } = req.query;

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if(err) return res.status(403).json("Token no valido");
        const lastSyncedAtFormatted = lastSyncedAt ? lastSyncedAt.replace("T", " ").slice(0,19) : null

        try {
            const data = await queryDatabase("call getter_attempt(?, ?)", [userInfo.id, lastSyncedAt == null || lastSyncedAt == "null" ? '1970-01-01 00:00:00' : lastSyncedAtFormatted ]);
            return res.status(200).json({ attempts: data[0]});
        } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ attempts: null});
        }
    });
};

// RANKING MONTHLY GET
export const rankingMonthly = (req, res) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json("Usuario no valido")

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if(err) return res.status(403).json("Token no valido");
        try {
            const ranking = await queryDatabase("SELECT * FROM ranking_monthly");
            const ownRanking = await queryDatabase("call getter_ranking_monthly(?)", [userInfo.id]);

            return res.status(200).json({ ranking: ranking, ownRanking: ownRanking[0][0]});
        } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ attempts: null});
        }
    });
}

// RANKING MONTHLY GET
export const rankingGlobal = (req, res) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json("Usuario no valido")

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if(err) return res.status(403).json("Token no valido");
        try {
            const ranking = await queryDatabase("SELECT * FROM ranking_global");
            const ownRanking = await queryDatabase("call getter_ranking_global(?)", [userInfo.id]);

            return res.status(200).json({ ranking: ranking, ownRanking: ownRanking[0][0]});
        } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ attempts: null});
        }
    });
}

// RANKING GLOBAL POS GET
export const rankingGlobalPos = (req, res) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json("Usuario no valido")

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if(err) return res.status(403).json("Token no valido");
        try {
            const ranking = await queryDatabase("select ranking from ranking_global where user_id = ?", [userInfo.id]);
            return res.status(200).json({ranking: ranking[0].ranking});
        } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ attempts: null});
        }
    });
}

// RANKING GET
export const rankingBasics = (req, res) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json("Usuario no valido")

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if(err) return res.status(403).json("Token no valido");
        try {
            const ranking = await queryDatabase("call getter_ranking(?)", [userInfo.id]);
            return res.status(200).json({ ownGlobal: ranking[0][0], ownMonthly: ranking[1][0], monthlyBattle: ranking[2]});
        } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ attempts: null});
        }
    });
}