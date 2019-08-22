import { Component, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
declare var $: any;

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from '../interfaces/Competition';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  closeResult: string;
  tournamentType: string = 'normal';
  email: string;
  password: string;
  alertVisible = false;
  alertContent: string;
  collapsed: boolean;
  private itemsDoc: AngularFirestoreCollection<Competition>;
  items: Observable<Competition[]>;
  currentCompetition: any;

  newCompForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    route: new FormControl(''),
    type: new FormControl('')
  });

  constructor(public afAuth: AngularFireAuth, afs: AngularFirestore, private modalService: NgbModal) {
    afs.collection('competitions').get();
    this.itemsDoc = afs.collection('competitions');
    this.items = this.itemsDoc.valueChanges();
  }

  @Output() changeComponent = new EventEmitter<any>();
  onClickSubmit(data) {
    this.afAuth.auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(res => {
        console.log(res);
        this.alertVisible = false;
      })
      .catch(error => {
        this.alertContent = error.message;
        this.alertVisible = true;
      });
  }
  onClickLogout() {
    this.afAuth.auth.signOut();
  }
  changeCompetition(item) {
    console.log(item);
    this.currentCompetition = item;
  }
  closeAlert() {
    this.alertVisible = false;
  }
  public ngOnInit() {
    $('btn').on('click', function() {
      $('btn').removeClass('selected');
      $(this).addClass('selected');
    });
  }

  async addNewComp() {
    console.log('CLOSE');
    console.log(JSON.stringify(this.newCompForm.value));
    if (this.newCompForm.value.name != '' && this.newCompForm.value.route != '') {
      await fetch('https://us-central1-bbq4it-b4163.cloudfunctions.net/api/competitions', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'X-HTTP-Method-Override': 'POST'
          // 'Content-Type': 'applicastion/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(this.newCompForm.value) // body data type must match "Content-Type" header
      })
        .then((response: any) => {
          return response.json();
        })
        .then((json: any) => {
          this.newCompForm.reset();
          this.modalService.dismissAll();
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }

  onButtonGroupClick($event) {
    let clickedElement = $event.target || $event.srcElement;

    if (clickedElement.nodeName === 'BUTTON') {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector('.active');
      // if a Button already has Class: .active
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove('active');
      }

      clickedElement.className += ' active';
    }
  }
  open(content) {
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
