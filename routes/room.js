import { joinRoom, handleDisconect, nameCheck } from "../controllers/room.js";
import express from "express";

const router = express.Router();

router.get("/name/check", nameCheck);

export const handleRoomSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`Jugador conectado: ${socket.id}`);

        // Evento para unirse a una sala
        socket.on('join-room', (roomCode) => joinRoom(socket, roomCode, io));

        // Evento para desconexion
        socket.on('disconnect', (socket) => handleDisconect(socket));
    });
};

export default router;