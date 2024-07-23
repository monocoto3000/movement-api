import { Server, Socket } from 'socket.io';
import connection from '../config/db';

export class WebSocketService {
  private packetBuffer: any[] = [];
  private isProcessing = false;

  constructor(private io: Server) {
    this.io.on('connection', this.handleConnection);
  }

  private handleConnection = (socket: Socket) => {
    console.log('WebSocket client connected');
    socket.on('userId', (userId: string) => {
      console.log(`Received userId: ${userId}`);
      if (userId) {
        socket.join(userId);
        console.log(`User ${socket.id} joined room ${userId}`);
      }
    });
    socket.on('newMovement', (movement) => {
      this.enqueuePacket({ event: 'newMovement', movement });
      this.processNextPacket();
    });
  };

  private enqueuePacket(packet: any) {
    this.packetBuffer.push(packet);
  }

  private processNextPacket() {
    if (this.packetBuffer.length > 0 && !this.isProcessing) {
      this.isProcessing = true;
      const packet = this.packetBuffer.shift();
      this.handlePacket(packet);
    }
  }

  private async handlePacket(packet: any) {
    const { event, movement  } = packet;
    console.log(packet)
    console.log(`Processing ${event} with data:`, movement);
    (await connection).execute('INSERT INTO movement (room_id, detected_at) VALUES (?, ?)', [movement.room_id, movement.detected_at])
    if (movement.room_id) {
      this.io.to(movement.room_id).emit(event, packet.movement);
    } else {
      console.log("Error finding users to send data")
    }
    this.isProcessing = false;
    this.processNextPacket();
  }
}