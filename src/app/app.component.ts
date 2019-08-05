import { Component } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" routerLink="#">BBQ4.IT</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <button
            *ngIf="afAuth.user | async as user"
            (click)="onClickLogout()"
            class="nav-item nav-link active logoutButton"
          >
            Logout <span class="sr-only">(current)</span>
          </button>
        </div>
      </div>
    </nav>

    <div *ngIf="afAuth.user | async as user; else showLogin">
      <app-competitions></app-competitions>
    </div>
    <ng-template #showLogin>
      <div class="loginPanel">
        <form #userlogin="ngForm" (ngSubmit)="onClickSubmit(userlogin.value)">
          <h2>Login panel</h2>
          <br />
          <input type="text" name="email" placeholder="Email" ngModel />
          <br />
          <input type="password" name="password" placeholder="Password" ngModel />
          <br />
          <input class="btn-primary" type="submit" value="Zaloguj" />
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
