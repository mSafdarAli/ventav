import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketPreviewRoutingModule } from './ticket-preview-routing.module';
import { PreviewComponent } from './preview/preview.component';
import { FormControllerModule } from 'src/app/shared/form-controller/form-controller.module';
import { PrintComponent } from './print/print.component';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [
    PreviewComponent,
    PrintComponent
  ],
  imports: [
    CommonModule,
    TicketPreviewRoutingModule,
    FormControllerModule,
    QRCodeModule
  ]
})
export class TicketPreviewModule { }
