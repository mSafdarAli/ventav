import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-redeem-iframe',
  templateUrl: './redeem-iframe.component.html',
  styleUrls: ['./redeem-iframe.component.scss']
})
export class RedeemIframeComponent implements OnInit {
  path: string;
  id: string;
  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<RedeemIframeComponent>) {
    this.path = this.data.path;
    this.id = this.data.id;
  }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close()
  }

}
