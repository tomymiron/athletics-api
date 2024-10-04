import roomRoutes, { handleRoomSocket } from "./routes/room.js";
import practiceRoutes from "./routes/practice.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

dotenv.config();
const app = express();

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors({
    origin: [
      process.env.CORS_ORIGIN,
      "http://localhost:5173",
      "http://192.168.0.74:5173",
    ],}),
);

// Main Socket
const server = http.createServer(app);
const io = new Server(server);
handleRoomSocket(io);

// Main Routes
app.use("/practice", practiceRoutes);
app.use("/user", userRoutes);
app.use("/room", roomRoutes);
app.use("/auth", authRoutes);

app.use("/", (req, res) => {
  res.status(200).send("<h1>Athletics Labs Api Working</h1>");
});

server.listen(8802, () => {
  console.log("Athletics Labs Api Working");
});