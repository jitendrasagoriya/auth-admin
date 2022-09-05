import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Authentication } from 'src/app/entity/dashboardResponce';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  filterForm: FormGroup;
  isLoggedIn: boolean = false;
  token: string;
  displayUsers:Authentication[] = [];  

  constructor() { }

  ngOnInit(): void {
  }

}
