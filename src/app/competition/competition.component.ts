import { Component, OnInit, Input, Directive } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from '../interfaces/Competition';
import { Score } from '../interfaces/Score';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent {
  _comp: Competition;
  afs: AngularFirestore;
  results: any;
  addScore = new FormGroup({
    nick: new FormControl(''),
    score: new FormControl('')
  });

  updateScoreForm = new FormGroup({
    nick: new FormControl(''),
    score: new FormControl('')
  });

  closeResult: string;
  currentItem: Score;

  @Input()
  set comp(comp: Competition) {
    if (comp !== undefined) {
      this._comp = comp;
      this.results = this.afs.collection<Score>(this._comp.route, ref => ref.orderBy('score', 'desc')).valueChanges();

      // zapytania w firestore https://firebase.google.com/docs/firestore/query-data/order-limit-data
    }
  }
  get comp() {
    return this._comp;
  }
  constructor(afs: AngularFirestore, private modalService: NgbModal) {
    this.afs = afs;
  }

  deleteScore() {
    let collection = this.afs.collection(this._comp.route);
    collection.ref
      .where('nick', '==', this.currentItem.nick)
      .where('score', '==', this.currentItem.score)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.id, ' => ', doc.data());
          let res = confirm('Jesteś pewien że chcesz usunąc ten wynik?');
          if (res) {
            collection.doc(doc.id).delete();
          }
        });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      })
      .finally(() => {
        this.updateScoreForm.reset();
        this.modalService.dismissAll('Cross click');
      });
  }

  updateScore() {
    let collection = this.afs.collection(this._comp.route);
    collection.ref
      .where('nick', '==', this.currentItem.nick)
      .where('score', '==', this.currentItem.score)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.id, ' => ', doc.data());
          console.log(this.updateScoreForm.value);
          collection.doc(doc.id).set(this.updateScoreForm.value);
        });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      })
      .finally(() => {
        this.updateScoreForm.reset();
        this.modalService.dismissAll('Cross click');
      });
  }

  onSort(event) {
    console.log(event);
  }
  onClickSubmit() {
    console.log(this.addScore.value);

    this.afs.collection(this._comp.route).add(this.addScore.value);
    this.addScore.reset();
  }

  open(content, item: Score) {
    this.currentItem = item;
    this.updateScoreForm.setValue(item);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
