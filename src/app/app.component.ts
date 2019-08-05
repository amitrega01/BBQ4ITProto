import { Component } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  template: `
    <div class="navbar">
      BBQ4.IT
      <button class="logoutButton" *ngIf="afAuth.user | async as user" (click)="onClickLogout()">
        <i class="fa fa-sign-out" style="font-size:20px;color:white"></i>
        Logout
      </button>
    </div>

    <div *ngIf="afAuth.user | async as user; else showLogin">
      <app-competitions></app-competitions>
    </div>
    <ng-template #showLogin>
      <div class="loginPanel">
        <form class="loginForm" #userlogin="ngForm" (ngSubmit)="onClickSubmit(userlogin.value)">
          <h2>Logowanie</h2>
          <br />
          <input class="loginInput" type="text" name="email" placeholder="Email" ngModel />

          <input class="loginInput" type="password" name="password" placeholder="Password" ngModel />

          <input class="loginInput" type="submit" value="Zaloguj" />
        </form>
      </div>
    </ng-template>
  `
})
export class AppComponent {
  email: string;
  password: string;

  constructor(public afAuth: AngularFireAuth) {}

  onClickSubmit(data) {
    this.afAuth.auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        alert(error.message);
      });
  }
  onClickLogout() {
    this.afAuth.auth.signOut();
  }

  login() {}
  logout() {
    this.afAuth.auth.signOut();
  }
}
