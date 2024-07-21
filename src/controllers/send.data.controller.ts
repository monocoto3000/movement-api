import { Request, Response } from 'express';

export const sendData = {
  handleRequest: (req: Request, res: Response) => {
    res.sendStatus(200); 
  }
};