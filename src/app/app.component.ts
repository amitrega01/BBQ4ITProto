import { Component, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from './interfaces/Competition';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  email: string;
  password: string;
  alertVisible = false;
  alertContent: string;
  collapsed: boolean;
  private itemsDoc: AngularFirestoreCollection<Competition>;
  items: Observable<Competition[]>;
  currentCompetition: any;
  constructor(public afAuth: AngularFireAuth, afs: AngularFirestore) {
    afs.collection('competitions').get();
    this.itemsDoc = afs.collection('competitions');
    this.items = this.itemsDoc.valueChanges();
  }

  @Output() changeComponent = new EventEmitter<any>();
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
  changeCompetition(item) {
    console.log(item);
    this.currentCompetition = item;
  }
  closeAlert() {
    this.alertVisible = false;
  }
}
