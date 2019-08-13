import { Component, OnInit, Input, Directive } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from '../interfaces/Competition';
import { Score } from '../interfaces/Score';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent {
  alertVisible = false;
  alertContent = '';
  alertType = 'warning';
  _comp: Competition;
  afs: AngularFirestore;
  results: any;
  addScore = new FormGroup({
    nick: new FormControl(''),
    score: new FormControl('')
  });

  updateScoreForm = new FormGroup({
    nick: new FormControl(''),
    score: new FormControl(''),
    added: new FormControl(''),
    postedBy: new FormControl(''),
    id: new FormControl('')
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
  constructor(
    afs: AngularFirestore,
    private modalService: NgbModal,
    public afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.afs = afs;
  }

  async deleteScore() {
    const res = confirm('Jesteś pewien że chcesz usunąc ten wynik?');
    if (res) {
      await this.apiRequest(null, 'PUT', this.currentItem.id);
    }
  }

  async updateScore() {
    await this.apiRequest({ old: this.currentItem, new: this.updateScoreForm.value }, 'PUT', this.currentItem.id).then(
      () => {
        this.updateScoreForm.reset();
        this.modalService.dismissAll('Cross click');
      }
    );
  }

  onSort(event) {
    console.log(event);
  }
  async onClickSubmit() {
    if (this.addScore.value.nick == '' || this.addScore.value.nick == null) {
      this.alertVisible = true;
      this.alertContent = 'Uzupełnij pole Nick';
      return;
    } else if (this.addScore.value.score == '' || this.addScore.value.score == null) {
      this.alertVisible = true;
      this.alertContent = 'Uzupełnij pole punkty';
      return;
    } else {
      this.alertVisible ? (this.alertVisible = false) : (this.alertVisible = false);
      const toAdd: Score = {
        score: this.addScore.value.score,
        nick: this.addScore.value.nick,
        added: moment(new Date()).format('hh:mm DD-MM-YYYY'),
        postedBy: this.afAuth.auth.currentUser.email
      };
      console.log(toAdd);
      await this.apiRequest(toAdd, 'POST', null);
    }
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
  closeWarning = () => (this.alertVisible = false);
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  apiRequest = async (body, type, id) => {
    let uri = `https://us-central1-bbq4it-b4163.cloudfunctions.net/api/score/${this._comp.route}`;
    if (id != null) {
      uri += `/${id}`;
    }
    await fetch(uri, {
      method: type, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'X-HTTP-Method-Override': type
        // 'Content-Type': 'applicastion/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(body) // body data type must match "Content-Type" header
    })
      .then((response: any) => {
        return response.json();
      })
      .then((json: any) => {
        this.alertType = json.type === 'OK' ? 'success' : 'warning';
        this.alertVisible = true;
        this.alertContent = json.msg;
        this.addScore.reset();
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
}
