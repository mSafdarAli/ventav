import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketPreviewRoutingModule } from './ticket-preview-routing.module';
import { PreviewComponent } from './preview/preview.component';


@NgModule({
  declarations: [
    PreviewComponent
  ],
  imports: [
    CommonModule,
    TicketPreviewRoutingModule
  ]
})
export class TicketPreviewModule { }
