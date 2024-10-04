import { queryDatabase } from "../db/connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// NAME CHECK GET
export const nameCheck = async (req, res) => {
    const { name } = req.query;
    if(!name) return res.status(400).json("Ningun nombre obtenido");

    try {
        const data = await queryDatabase("call rooms_name_check(?)", [name]);
        console.log(name, { inUse: data[0].length > 0 })
        return res.status(200).json({ inUse: data[0].length > 0 });
    } catch (err) {
        console.log("ERROR:", err);
        return res.status(500).json({ success: false });
    }
};

const rooms = {};

export const joinRoom = (socket, roomCode, io) => {
    console.log(`Jugador ${socket.id} se unió a la sala ${roomCode}`);
    if (!rooms[roomCode]) rooms[roomCode] = [];

    if (rooms[roomCode].length < 2) {
        rooms[roomCode].push(socket.id);
        socket.join(roomCode);

        if (rooms[roomCode].length === 2) io.to(roomCode).emit('start-game', 'Ambos jugadores conectados. ¡Comienza el juego!');
    } else socket.emit('room-full', 'La sala ya está llena');
};

export const handleDisconect = (socket) => {
    console.log(`Jugador desconectado: ${socket.id}`);
}