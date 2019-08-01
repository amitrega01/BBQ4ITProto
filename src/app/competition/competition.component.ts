import { Component, OnInit, Input } from "@angular/core";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
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
  _comp: any;
  db: AngularFireDatabase;
  @Input()
  set comp(comp: any) {
    if (comp != undefined) {
      this._comp = comp;
    }
  }
  get comp() {
    return this._comp;
  }
  constructor(db: AngularFireDatabase) {
    this.db = db;
  }
  ngOnInit() {}

  onClickSubmit(data) {
    this.db.object(this._comp.name).set(data);
  }
}
