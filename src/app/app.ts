import { Component, signal } from '@angular/core';
import { MainLayout } from './layout/main-layout/main-layout';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MainLayout,
    HttpClient
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
