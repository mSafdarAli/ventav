import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lookupdata } from 'src/_models/lookup';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit {
  form: FormGroup;
  selectRegion: lookupdata[] = [];
  selectFirm: lookupdata[] = [];
  selectMerchant: lookupdata[] = [];
  selectIndustry: lookupdata[] = [];
  selectDate: lookupdata[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AdvanceSearchComponent>,
    private router:Router
  ) {
    this.form = this.formBuilder.group({
      industry: [''],
      merchant: [''],
      firm: [''],
      region: [''],
      date: [''],
      date_from: [''],
      date_to: [''],
    });
    this.selectRegion.push({ name: 'test', value: 'test' }, { name: 'test1', value: 'test1' });
    this.selectFirm.push({ name: 'test', value: 'test' }, { name: 'test1', value: 'test1' });
    this.selectMerchant.push({ name: 'test', value: 'test' }, { name: 'test1', value: 'test1' });
    this.selectIndustry.push({ name: 'test', value: 'test' }, { name: 'test1', value: 'test1' });
    this.selectDate.push({ name: 'test', value: 'test' }, { name: 'test1', value: 'test1' }, { name: 'custom', value: 'custom' });
  }
  ngOnInit(){
  }

 
  submit(){
    // const { page, ...restPrams } = this.params;
    const filter = this.removeEmptyStringsFrom(this.form.value);
    // const param = { ...restPrams, ...filter };
    this.router.navigate([], { queryParams: filter });
    this.dialogRef.close();
  }
  removeEmptyStringsFrom(obj) {
    const clone = { ...obj };
    Object.entries(clone).forEach(
      ([key, val]) => (val === '' || val === null) && delete clone[key]
    );
    return clone;
  }
  close() {
    this.dialogRef.close();
  }
}

