import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Competition } from "../Competition";

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
  private itemsDoc: AngularFirestoreCollection<Competition>;
  items: Observable<Competition[]>;
  currentCompetition: any;
  constructor(private afs: AngularFirestore) {
    this.itemsDoc = afs.collection("competitions");
    this.items = this.itemsDoc.valueChanges();
  }
  changeCompetition(item) {
    console.log(item);
    this.currentCompetition = item;
  }
}
