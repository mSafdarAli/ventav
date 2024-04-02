import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-checkout-iframe',
  templateUrl: './checkout-iframe.component.html',
  styleUrls: ['./checkout-iframe.component.scss']
})
export class CheckoutIframeComponent implements OnInit {
  path: string;
  id: string;
  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<CheckoutIframeComponent>) {
    this.path = this.data.path;
    this.id = this.data.id;
  }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close()
  }
}
