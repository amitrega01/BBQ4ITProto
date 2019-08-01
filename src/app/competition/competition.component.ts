import { Component, OnInit, Input } from "@angular/core";
@Component({
  selector: "app-competition",
  template: `
    {{ _comp.name }}
  `,
  styleUrls: ["./competition.component.css"]
})
export class CompetitionComponent implements OnInit {
  _comp: any = { name: "", route: "" };

  @Input()
  set comp(comp: any) {
    if (comp != undefined) {
      this._comp = comp;
    }
  }
  get comp() {
    return this._comp;
  }
  constructor() {}
  ngOnInit() {}
}
