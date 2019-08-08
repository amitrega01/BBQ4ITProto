import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from '../interfaces/Competition';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html'
})
export class CompetitionsComponent {
  private itemsDoc: AngularFirestoreCollection<Competition>;
  items: Observable<Competition[]>;
  currentCompetition: any;
  constructor(private afs: AngularFirestore) {
    this.itemsDoc = afs.collection('competitions');
    this.items = this.itemsDoc.valueChanges();
  }
  changeComponent($event) {
    console.log("HELL")
    console.log($event + "Asdsa");
    // this.currentCompetition = item;
    // this.selectedcompetition = item.name;
  }
  selectedcompetition: String = 'Wybierz konkurencję';

  changeCompetition(item) {
    console.log(item);
    this.currentCompetition = item;
    this.selectedcompetition = item.name;
  }



}
