import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {DummyService} from "./dummy.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService, private dummyService: DummyService) {}

  ngOnInit() {
this.authService.autologin();
this.dummyService.printLog('Hello from AppComponent ngOnInit');
  }

}

