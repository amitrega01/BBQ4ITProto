import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFireDatabase } from "@angular/fire/database";
@Component({
  selector: "app-competitions",
  template: `
    <ul>
      <nav>
        <li *ngFor="let item of items | async">
          <button (click)="changeCompetition(item)">
            {{ item.name | json }}
          </button>
        </li>
      </nav>
    </ul>
    <app-competition [comp]="currentCompetition"></app-competition>
  `
})
export class CompetitionsComponent {
  items: Observable<any[]>;
  currentCompetition: any;
  constructor(db: AngularFireDatabase) {
    this.items = db.list("competitions").valueChanges();
  }
  changeCompetition(item) {
    console.log(item);
    this.currentCompetition = item;
  }
}
