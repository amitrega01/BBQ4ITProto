import { Component, OnInit, Input, Directive } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from '../interfaces/Competition';
import { Score } from '../interfaces/Score';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {
  _comp: Competition;
  afs: AngularFirestore;
  results: any;
  addScore = new FormGroup({
    nick: new FormControl(''),
    score: new FormControl('')
  });

  @Input()
  set comp(comp: Competition) {
    if (comp !== undefined) {
      this._comp = comp;
      this.results = this.afs.collection<Score>(this._comp.route, ref => ref.orderBy('score', 'desc')).valueChanges();

      // zapytania w firestore https://firebase.google.com/docs/firestore/query-data/order-limit-data
    }
  }
  get comp() {
    return this._comp;
  }

  constructor(afs: AngularFirestore) {
    this.afs = afs;
  }

  ngOnInit() {}

  onClickSubmit() {
    console.log(this.addScore.value);

    this.afs.collection(this._comp.route).add(this.addScore.value);
    this.addScore.reset();
  }
}
