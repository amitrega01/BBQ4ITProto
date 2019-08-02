import { Component, OnInit, Input } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Competition } from "../interfaces/Competition";
import { Score } from "../interfaces/Score";
import { Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
@Component({
  selector: "app-competition",
  templateUrl: "./competition.component.html",
  styleUrls: ["./competition.component.css"]
})
export class CompetitionComponent implements OnInit {
  _comp: Competition;
  afs: AngularFirestore;
  results: Observable<Score[]>;
  @Input()
  set comp(comp: Competition) {
    if (comp != undefined) {
      this._comp = comp;

      this.results = this.afs
        .collection<Score>(this._comp.route)
        .valueChanges();
    }
  }
  get comp() {
    return this._comp;
  }

  constructor(afs: AngularFirestore) {
    this.afs = afs;
  }

  ngOnInit() {}

  onClickSubmit(score: Score) {
    this.afs.collection(this._comp.route).add(score);
  }
}
