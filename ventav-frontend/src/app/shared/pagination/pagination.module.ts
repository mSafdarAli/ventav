import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { FormControllerModule } from '../form-controller/form-controller.module';
import { CommonPaginationComponent } from './common-pagination/common-pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
	declarations: [PaginationComponent, CommonPaginationComponent],
	imports: [
		CommonModule,
		FormControllerModule,
		NgxPaginationModule
	],
	exports: [PaginationComponent, CommonPaginationComponent]
})
export class PaginationModule { }
