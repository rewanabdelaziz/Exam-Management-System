import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GloabalLoader } from "./shared/component/gloabal-loader/gloabal-loader";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GloabalLoader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ExamManagementSystem');
}
