import { Component, OnInit, Input } from '@angular/core';
import { Score } from '../interfaces/Score';
import { Competition } from '../interfaces/Competition';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from 'selenium-webdriver/http';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  afs: AngularFirestore;
  closeResult: string;
  currentItem: Score;
  results: any;
  tree: any;
  _comp: Competition;
  pos: number;
  mobile: Boolean;
  resultsPodium: any;
  resultsAfterPodium: any;
  showDetails: boolean;
  size: number;

  constructor(afs: AngularFirestore) {
    this.afs = afs;
    this.pos = 0;
  }

  ngOnInit() {
    if (screen.width < 576) {
      // 768px portrait
      this.mobile = true;
    } else this.mobile = false;
    console.log(this.size);
  }

  toggle() {
    this.showDetails = !this.showDetails;
  }
  getScreenWidth(event) {
    //var w = document.documentElement.clientWidth;
    var w = event.target.innerWidth;
    if (w < 576) {
      // 768px portrait
      this.mobile = true;
    } else this.mobile = false;
  }

  @Input()
  set comp(comp: Competition) {
    if (comp !== undefined) {
      this._comp = comp;
      if (this._comp.type == 'normal') {
        this.results = this.afs
          .collection<Score>(this._comp.route, ref => ref.orderBy('score', 'desc').limit(10))
          .valueChanges();
        this.resultsPodium = this.afs
          .collection<Score>(this._comp.route, ref => ref.orderBy('score', 'desc').limit(3))
          .valueChanges();
        this.resultsAfterPodium = this.afs
          .collection<Score>(this._comp.route, ref => ref.orderBy('score', 'desc').limit(10))
          .valueChanges();
      } else {
        this.afs
          .collection(this._comp.route)
          .doc('tree')
          .get()
          .toPromise()
          .then(doc => {
            if (!doc.exists) {
              console.log('No such document!');
              this.tree = undefined;
            } else {
              console.log('Pobrano z bazy');
              console.log('PRZED');
              console.log(this.tree);
              console.log('PO');
              this.tree = JSON.parse(doc.data().type);
            }
          });
        this.afs
          .collection(this._comp.route)
          .doc('tree')
          .snapshotChanges()
          .subscribe(() => {
            this.afs
              .collection(this._comp.route)
              .doc('tree')
              .get()
              .toPromise()
              .then(doc => {
                if (!doc.exists) {
                  console.log('No such document!');
                  this.tree = undefined;
                } else {
                  console.log('Pobrano z bazy');
                  console.log('PRZED');
                  console.log(this.tree);
                  console.log('PO');
                  this.tree = JSON.parse(doc.data().type);
                }
              });
          });
      }
      //  zapytania w firestore https://firebase.google.com/docs/firestore/query-data/order-limit-data
    }
  }
  getResults(count) {
    return this.results;
  }
}
