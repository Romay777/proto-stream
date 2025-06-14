import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { AuthService } from '../../auth/auth.service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {Subscription} from 'rxjs';
import {Message} from './message.interface';




@Component({
  selector: 'app-chat-bar',
  templateUrl: './chat-bar.component.html',
  styleUrls: ['./chat-bar.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ]
})
export class ChatBarComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  message: Message = { user_id: '', username: '', chat_id: '', message: '', timestamp: '' };
  text: string = '';

  chatId = '2';
  private messageSubscription: Subscription | null = null;


  constructor(private chatService: ChatService, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.chatService.connect(this.chatId);
    }
    // Подписка на новые сообщения
    this.messageSubscription = this.chatService.messages$.subscribe((data: Message) => {
      this.messages.push(data); // Добавляем сообщение в массив
    });
  }

  ngOnDestroy() {
    this.chatService.disconnect();

    // Отписываемся от сообщений
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  sendMessage() {
    if (this.authService.isAuthenticated && this.text.trim()) {
      this.message.user_id = this.authService.getUserIdFromToken || '';
      this.message.username = <string><unknown>this.authService.getUsernameByUserId(this.message.user_id) || '';
      this.message.chat_id = this.chatId;
      this.message.message = this.text.trim();
      this.message.timestamp = new Date().toISOString();

      this.chatService.sendMessageToWS( this.message);
      this.messages.push(this.message); // Add to local UI
      this.message.message = '';
    } else {
      console.error('User is not authenticated or message is empty.');
    }
  }


  onMessageReceived(data: Message) {
    this.messages.push(data);
  }
}
