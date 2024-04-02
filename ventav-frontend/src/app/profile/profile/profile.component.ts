import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  constructor(private formBuilder:FormBuilder) { 
    this.form = this.formBuilder.group({
      email: [null],
      name: [null],
      roleId: [null],
      
    });
  }

  ngOnInit(): void {
  }

}
