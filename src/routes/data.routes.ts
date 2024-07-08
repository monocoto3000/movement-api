import express from 'express';
import { saveData } from '../controllers/save.data.controller';
import { getData } from '../controllers/get.data.controller';
import { Server } from 'socket.io';
import { verifyToken } from '../middleware/middleware';

const router = express.Router();

export default (io: Server) => {
    router.post('/data', verifyToken, saveData(io));
    router.get('/getData/:id', verifyToken, getData)
    return router;
  };

