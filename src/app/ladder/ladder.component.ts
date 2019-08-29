import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import shuffle from './shuffle';
import { Competition } from '../interfaces/Competition';
import { AngularFirestore } from '@angular/fire/firestore';
import { Guid } from 'guid-typescript';
import { classToPlain, plainToClass, Type } from 'class-transformer';
export interface User {
  nick: string;
}
export class Bracket {
  public id: any;
  public parentId: Guid;
  result: User[] = [];
  children: Bracket[];
  parent: Bracket;
  locked: boolean;
  constructor() {
    this.id = Guid.create();
  }
  setParent(parent: Bracket) {
    this.parent = parent;
    this.parentId = parent.id;
    return this;
  }
  setResult(index: number) {
    console.log('PARENT');
    if (!this.locked) {
      console.log(this.parent);
      this.parent.result.push(this.result[index]);
      this.locked = true;
    } else {
      this.parent.result.pop();
      this.locked = false;
    }
    return this;
  }
  isTheSame(parentGuid: any) {
    if (parentGuid.value == this.id.value) {
      console.log('ZNALEZIONO');
      return true;
    } else {
      return false;
    }
  }
}

export class Tree {
  @Type(() => Bracket)
  root: Bracket = new Bracket();

  winner: User;
  @Type(() => Bracket)
  flat: Bracket[];
  @Type(() => Bracket)
  rounds: any[][] = new Array([this.root]);
}

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrls: ['./ladder.component.css']
})
export class LadderComponent implements OnInit {
  users: User[] = [];
  addUser = new FormGroup({
    nick: new FormControl('')
  });
  winner: User;
  tournamentReady: boolean;
  roundCount = 0;
  tree: Tree;
  _comp: Competition;
  afs: AngularFirestore;
  treeView: Tree;

  constructor(afs: AngularFirestore) {
    this.afs = afs;

    this.tournamentReady = false;
  }
  @Input()
  set comp(comp: Competition) {
    if (comp !== undefined) {
      this._comp = comp;
      this.afs
        .collection(this._comp.route)
        .doc('tree')
        .get()
        .toPromise()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
            this.tree = undefined;
          } else {
            console.log('Pobrano z bazy');
            console.log('PRZED');
            console.log(this.tree);
            console.log('PO');
            console.log(plainToClass(Tree, JSON.parse(doc.data().type)));
            this.tree = plainToClass(Tree, JSON.parse(doc.data().type));
          }
        });
      this.afs
        .collection(this._comp.route)
        .doc('tree')
        .snapshotChanges()
        .subscribe(() => {
          this.afs
            .collection(this._comp.route)
            .doc('tree')
            .get()
            .toPromise()
            .then(doc => {
              if (!doc.exists) {
                console.log('No such document!');
                this.tree = undefined;
              } else {
                console.log('Pobrano z bazy');
                console.log('PRZED');
                console.log(this.tree);
                console.log('PO');
                console.log(plainToClass(Tree, JSON.parse(doc.data().type)));
                this.tree = plainToClass(Tree, JSON.parse(doc.data().type));
              }
            });
        });
      // zapytania w firestore https://firebase.google.com/docs/firestore/query-data/order-limit-data
    }
  }
  get comp() {
    return this._comp;
  }
  ngOnInit() {}
  onClickSubmit() {
    this.users.push(this.addUser.value);
    console.log(this.users);
    this.addUser.reset();
    if (this.users.length >= 8 && this.users.length % 2 === 0) {
      console.log('PO LOSOWANIU');
      console.log(this.users);
      this.tournamentReady = true;
    }
  }
  async launchTournament() {
    this.tree = new Tree();
    this.users = shuffle(this.users);
    let rounds = 1;
    for (let i = 0; i < this.users.length / 2; i++) {
      if (Math.pow(2, i) == this.users.length) {
        rounds = i;
        break;
      }
    }
    console.log(rounds);
    let x = 1;
    while (Math.pow(2, x) <= this.users.length / 2) {
      console.log('DODAWANIE DO RUNDY ' + x);
      this.tree.rounds.push(new Array());
      for (let i = 0; i < Math.pow(2, x); i++) {
        let index = 0;
        if (i % 2) {
          index = Math.round(i / 2) - 1;
        } else {
          index = Math.round((i + 1) / 2) - 1;
        }
        this.tree.rounds[x].push(new Bracket().setParent(this.tree.rounds[x - 1][index]));
      }
      x++;
    }
    for (let i = 0; i < this.tree.rounds[x - 1].length; i++) {
      this.tree.rounds[x - 1][i].result.push(this.users.pop(), this.users.pop());
    }
    console.dir(classToPlain(this.tree));
    await this.pushToFirebase();
  }
  async setResult(bracket: Bracket, index: number) {
    if (bracket.parentId != undefined) {
      console.log('SZUKAM BRACKET O ID: ' + bracket.parentId.toString());
      this.tree.rounds.forEach(round => {
        round.forEach((el: Bracket) => {
          console.log(el.id);
          if (bracket.locked) {
            if (el.isTheSame(bracket.parentId as Guid)) {
              console.log('FOUND ID');
              el.result.pop();
              bracket.locked = false;
            }
          } else {
            if (el.isTheSame(bracket.parentId as Guid)) {
              console.log('FOUND ID');
              el.result.push(bracket.result[index]);
              bracket.locked = true;
            }
          }
        });
      });
    } else {
      if (bracket.locked) {
        this.tree.winner = undefined;
        bracket.locked = false;
      } else {
        console.log('WINNER');
        console.log(bracket.result[index]);
        this.tree.winner = bracket.result[index];
        bracket.locked = true;
      }
    }
    await this.pushToFirebase();
  }
  shuffle(array: any[]): any {
    const oldArray = [...array];
    let newArray = new Array<any>();
    this.afs
      .collection(this._comp.route)
      .doc<Tree>('tree')
      .get()
      .toPromise()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data().type);
          console.log(plainToClass(Tree, JSON.parse(doc.data().type)));
          this.tree = plainToClass(Tree, JSON.parse(doc.data().type));
        }
      });
    while (oldArray.length) {
      const i = Math.floor(Math.random() * oldArray.length);
      newArray = newArray.concat(oldArray.splice(i, 1));
    }

    return newArray;
  }
  async pushToFirebase() {
    await fetch(`https://us-central1-bbq4it-b4163.cloudfunctions.net/api/ladder/${this._comp.route}`, {
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
      body: JSON.stringify(classToPlain(this.tree)) // body data type must match "Content-Type" header
    })
      .then((response: any) => {
        return response.json();
      })
      .then((json: any) => {
        console.log('response => ' + json);
      });
  }
}
