import { Component } from '@angular/core';
import {NavBarComponent} from '../../ui/nav-bar/nav-bar.component';
import {SideBarComponent} from '../../ui/side-bar/side-bar.component';
import {ChatBarComponent} from '../../ui/chat-bar/chat-bar.component';
import {MainScreenComponent} from '../../ui/main-screen/main-screen.component';

@Component({
  selector: 'app-main-page',
  imports: [
    NavBarComponent,
    SideBarComponent,
    ChatBarComponent,
    MainScreenComponent
  ],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
