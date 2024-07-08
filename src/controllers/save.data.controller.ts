import { Request, Response } from 'express';
import saveDataService from '../services/save.data.service';
import { Server } from 'socket.io';

export const saveData = (io: Server) => async (req: Request, res: Response) => {
  try {
    await saveDataService(req.body, io);
    res.status(200).send('Data saved successfully');
  } catch (error) {
    res.status(500).send('Error saving data');
  }
};
