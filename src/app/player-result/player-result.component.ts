import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-result',
  templateUrl: './player-result.component.html',
  styleUrls: ['./player-result.component.css']
})
export class PlayerResultComponent implements OnInit {

  constructor() { }
  username:string = "";
  ngOnInit() {

  }
  submitClick() {
    console.log(this.username);
  }

}
