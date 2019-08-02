import { Component, OnInit, Input } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Competition } from "../Competition";
import { Score } from "../Score";
@Component({
  selector: "app-competition",
  template: `
    <div *ngIf="_comp != undefined">
      <h2>{{ _comp.name }}</h2>
      <form #addScore="ngForm" (ngSubmit)="onClickSubmit(addScore.value)">
        <input type="text" name="nick" placeholder="Nick" ngModel />
        <br />
        <input type="number" name="points" placeholder="Punkty" ngModel />
        <br />
        <input type="submit" value="submit" />
      </form>
    </div>
  `,
  styleUrls: ["./competition.component.css"]
})
export class CompetitionComponent implements OnInit {
  _comp: Competition;
  afs: AngularFirestore;

  @Input()
  set comp(comp: Competition) {
    if (comp != undefined) {
      this._comp = comp;
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
