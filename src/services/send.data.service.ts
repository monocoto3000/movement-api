import { Server, Socket } from 'socket.io';
// import connection from '../config/db';

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

  // si se chispa poner el async ojala no explote todo
  private async handlePacket(packet: any) {
    const { event, data } = packet;
    console.log(`Processing ${event} with data:`, data);
    // (await connection).execute('INSERT INTO movements (movement_id, value) VALUES (?, ?)', [data.movement_id, data.value])
    if (data.id) {
      this.io.to(data.id).emit(event, data);
    } else {
      console.log("Error finding users to send data")
    }
    this.isProcessing = false;
    this.processNextPacket();
  }
}