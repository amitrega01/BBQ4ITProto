import { Component, Input, OnInit } from '@angular/core';

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

    <div class="xd">
      <div *ngIf="afAuth.user | async as user; else showLogin">
        <app-competitions></app-competitions>
      </div>

      <div class="loginPanel">
        <ng-template #showLogin>
          <div id="test">
            <form #userlogin="ngForm" (ngSubmit)="onClickSubmit(userlogin.value)">
              <h2>Login panel</h2>
              <br />
              <input type="text" name="email" placeholder="Email" ngModel />
              <br />
              <input type="password" name="password" placeholder="Password" ngModel />
              <br />
              <input type="submit" value="submit" />
            </form>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class AppComponent {
  email: string;
  password: string;
  constructor(public afAuth: AngularFireAuth) {}

  ngOnInit() {
    console.log('Init');
  }
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
