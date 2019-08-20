import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import shuffle from './shuffle';

export interface User {
  nick: string;
}
export class Bracket {
  result: User[] = [];
  children: Bracket[];
  parent: Bracket;
  locked: boolean;

  setParent(parent: Bracket) {
    this.parent = parent;
    return this;
  }
  setResult(index: number) {
    if (!this.locked) {
      this.parent.result.push(this.result[index]);
      this.locked = true;
    } else {
      this.parent.result.pop();
      this.locked = false;
    }
  }
}

export class Tree {
  root: Bracket = new Bracket();
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
  tournamentReady: boolean;
  roundCount = 0;
  tree: Tree;
  constructor() {
    for (let i = 0; i < 16; i++) {
      this.users.push({ nick: i.toString() });
    }
    this.tournamentReady = true;
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
  launchTournament() {
    this.tree = new Tree();
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
    console.dir(this.tree);
  }
  shuffle(array: any[]): any {
    const oldArray = [...array];
    let newArray = new Array<any>();

    while (oldArray.length) {
      const i = Math.floor(Math.random() * oldArray.length);
      newArray = newArray.concat(oldArray.splice(i, 1));
    }

    return newArray;
  }
}
