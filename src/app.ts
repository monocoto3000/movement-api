import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import dataRoutes from './routes/data.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());

app.use('/movements', dataRoutes(io));

app.disable('x-powered-by');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
