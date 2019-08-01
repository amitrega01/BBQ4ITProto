import { Component, Input, OnInit } from "@angular/core";

import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";

@Component({
  selector: "app-root",
  template: `
    <div *ngIf="afAuth.user | async as user; else showLogin">
      <h1>Hello {{ user.displayName }}!</h1>
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #showLogin>
      <h2>Login</h2>
      <form #userlogin="ngForm" (ngSubmit)="onClickSubmit(userlogin.value)">
        <input type="text" name="email" placeholder="Email" ngModel />
        <br />
        <input type="password" name="password" placeholder="Password" ngModel />
        <br />
        <input type="submit" value="submit" />
      </form>
    </ng-template>
  `
})
export class AppComponent {
  constructor(public afAuth: AngularFireAuth) {}
  email: string;
  password: string;
  onClickSubmit(data) {
    this.afAuth.auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(res => {
        console.log(res);
      });
  }
  login() {}
  logout() {
    this.afAuth.auth.signOut();
  }
}
