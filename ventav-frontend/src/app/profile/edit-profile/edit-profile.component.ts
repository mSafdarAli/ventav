import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lookupdata } from 'src/_models/lookup';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  form: FormGroup;
  selectRole:lookupdata[]=[];
  constructor(
    private formBuilder:FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      email: [null, [Validators.required]],
      name:[null,[Validators.required]],
      roleId:[null,[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getAllRoles();
  }
  getAllRoles(){

  }

}
