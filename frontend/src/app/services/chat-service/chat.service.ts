import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../auth/auth.service';
import {inject, Injectable} from '@angular/core';
import {Message} from '../../ui/chat-bar/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<Message>(); // Subject для сообщений
  authService = inject(AuthService);

  // Observable для сообщений
  messages$ = this.messageSubject.asObservable();

  connect(chatId: string) {
    this.socket = new WebSocket(environment.wsUrl + '?chatId=' + chatId);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      console.log('Message received:', event.data);
      this.messageSubject.next(event.data); // Уведомляем подписчиков о новом сообщении
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessageToWS(msg: Message) {
    const userId = this.authService.getUserIdFromToken;

    if (userId == null) {
      console.error('User ID not found or not authenticated.');
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      console.error('WebSocket is not open.');
    }
  }
}
