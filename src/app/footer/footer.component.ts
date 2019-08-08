import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth) { }

  onClickLogout() {
    this.afAuth.auth.signOut();
  }

  ngOnInit() {
  }

}
