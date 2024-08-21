import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3003, { cors: { origin: '*' }, host: '0.0.0.0' })  // Bind to 0.0.0.0 to allow external connections
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message_to_server')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message_from_vehicle', message);
  }

  sendMessage(message: string) {
    this.server.emit('message_from_vehicle', message);
  }
}
