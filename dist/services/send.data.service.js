"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const db_1 = __importDefault(require("../config/db"));
class WebSocketService {
    constructor(io) {
        this.io = io;
        this.packetBuffer = [];
        this.isProcessing = false;
        this.handleConnection = (socket) => {
            console.log('WebSocket client connected');
            socket.on('userId', (userId) => {
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
        this.io.on('connection', this.handleConnection);
    }
    enqueuePacket(packet) {
        this.packetBuffer.push(packet);
    }
    processNextPacket() {
        if (this.packetBuffer.length > 0 && !this.isProcessing) {
            this.isProcessing = true;
            const packet = this.packetBuffer.shift();
            this.handlePacket(packet);
        }
    }
    handlePacket(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            const { event, data } = packet;
            console.log(`Processing ${event} with data:`, data);
            (yield db_1.default).execute('INSERT INTO movements (room_id, detected_at) VALUES (?, ?)', [data.room_id, data.detected_at]);
            if (data.id) {
                this.io.to(data.room_id).emit(event, data);
            }
            else {
                console.log("Error finding users to send data");
            }
            this.isProcessing = false;
            this.processNextPacket();
        });
    }
}
exports.WebSocketService = WebSocketService;
