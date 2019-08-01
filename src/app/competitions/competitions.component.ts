import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFireDatabase } from "@angular/fire/database";

@Component({
  selector: "app-competitions",
  template: `
    <ul>
      <li *ngFor="let item of items | async">
        <a href="/{{ item.route }}"> {{ item.name | json }}</a>
      </li>
    </ul>
  `
})
export class CompetitionsComponent {
  items: Observable<any[]>;
  constructor(db: AngularFireDatabase) {
    this.items = db.list("competitions").valueChanges();
  }
}
