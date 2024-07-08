import connection from '../config/db';
import { Data } from '../models/data.model';
import { Server } from 'socket.io';

const saveDataService = async (data: Data, io: Server) => {
  const { name, value, created_by } = data;
  const conn = await connection;
  try {
    await conn.execute(
      'INSERT INTO movements (name, value, created_by) VALUES (?, ?, ?)',
      [name, value, created_by]
    );
    io.to(String(created_by)).emit('newMovement', data);
  } finally {
    await conn.end();
  }
};

export default saveDataService;
