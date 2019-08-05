import { Component, Input, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  template: `

  <div class= "navbar">
    BBQ4.IT
    <button class="logoutButton" *ngIf="afAuth.user | async as user" (click)="onClickLogout()"> 
    <i class="fa fa-sign-out" style="font-size:20px;color:white"></i>
      Logout
    </button>
  </div>

  <div class="xd">
  
  
    <div *ngIf="afAuth.user | async as user; else showLogin">
      <app-competitions></app-competitions>
    </div>
 
    <div class="loginPanel"> 
   
    <ng-template #showLogin>
     
      <div id="test">
        <form  #userlogin="ngForm" (ngSubmit)="onClickSubmit(userlogin.value)">
          <h2>Login panel</h2>
          <br/>
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
    this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password).then(res => {
      console.log(res);
    });
  }
  onClickLogout()
  {
    this.afAuth.auth.signOut();
  }

  
  login() {}
  logout() {
    this.afAuth.auth.signOut();
  }
}
