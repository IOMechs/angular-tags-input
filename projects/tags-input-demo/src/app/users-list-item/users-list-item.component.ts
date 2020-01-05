import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tid-users-list-item',
  templateUrl: './users-list-item.component.html',
  styleUrls: ['./users-list-item.component.scss']
})
export class UsersListItemComponent implements OnInit {

  @Input() item;
  @Input() config;

  constructor() { }
  ngOnInit() {
  }

}
