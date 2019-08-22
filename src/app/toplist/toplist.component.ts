import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from '../interfaces/Competition';
import { Observable } from 'rxjs';
import { Score } from '../interfaces/Score';
@Component({
  selector: 'app-toplist',
  templateUrl: './toplist.component.html',
  styleUrls: ['./toplist.component.css']
})
export class TopListComponent {
  title = 'toplist';
  private itemsDoc: AngularFirestoreCollection<Competition>;
  items: Observable<Competition[]>;
  currentCompetition: any;
  _comp: Competition;
  afs: AngularFirestore;
  results: any;
  closeResult: string;
  currentItem: Score;

  changeCompetition(item) {
    console.log(item);
    this.currentCompetition = item;
  }

  constructor(afs: AngularFirestore) {
    this.itemsDoc = afs.collection('competitions');
    this.items = this.itemsDoc.valueChanges();
  }
}
