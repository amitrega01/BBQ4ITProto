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
  afs :AngularFirestore;
  closeResult: string;
  currentItem: Score;
  results: any;
  _comp: Competition;
  pos: number;
  mobile:Boolean;
  resultsPodium:any;
  resultsAfterPodium: any;
  showDetails:boolean;
  size:number;

  constructor(afs :AngularFirestore) {
    this.afs = afs;
    this.pos=0; }

    ngOnInit() {
      
      if (screen.width < 576) { // 768px portrait
        this.mobile = true;
      }
      else this.mobile= false;
      console.log(this.size);
    }
  
    toggle() {
      this.showDetails=!this.showDetails;
    }
    getScreenWidth(event) {
      //var w = document.documentElement.clientWidth;
      var w = event.target.innerWidth;
      if (w < 576) { // 768px portrait
        this.mobile = true;
      }
      else this.mobile= false;
    }

  @Input()
  set comp(comp: Competition) {
    if (comp !== undefined) {
      this._comp = comp;
      this.results = this.afs.collection<Score>(this._comp.route, ref => ref.orderBy('score', 'desc').limit(10)).valueChanges();
      this.resultsPodium=this.afs.collection<Score>(this._comp.route, ref => ref.orderBy('score', 'desc').limit(3)).valueChanges();
      this.resultsAfterPodium=this.afs.collection<Score>(this._comp.route, ref => ref.orderBy('score', 'desc').limit(10)).valueChanges();

      // zapytania w firestore https://firebase.google.com/docs/firestore/query-data/order-limit-data
    }
  }
 getResults(count)
 {
   return this.results;
 }

 

}
