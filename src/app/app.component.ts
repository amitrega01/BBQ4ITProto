import { Component, ViewChild, ElementRef } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  email: string;
  password: string;
  alertVisible = false;
  alertContent: string;
  constructor(public afAuth: AngularFireAuth, afs: AngularFirestore) {
    afs.collection('competitions').get();
  }

  onClickSubmit(data) {
    this.afAuth.auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        this.alertContent = error.message;
        this.alertVisible = true;
      });
  }
  onClickLogout() {
    this.afAuth.auth.signOut();
  }

  login() {}
  logout() {
    this.afAuth.auth.signOut();
  }
  closeAlert() {
    this.alertVisible = false;
  }
}
