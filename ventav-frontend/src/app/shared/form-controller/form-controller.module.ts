import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { VMessageComponent } from './v-message/v-message.component';
import { LbAutoCompleteComponent } from './lb-auto-complete/lb-auto-complete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PermissionsDirective } from './permissions.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePcikerComponent } from './date-picker/date-pciker.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PromptComponent } from './prompt/prompt.component';
import { LoadingComponent } from './loading/loading.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { NgxEditorModule } from 'ngx-editor';
import { IframeComponent } from './iframe/iframe.component';





@NgModule({
	declarations: [
		VMessageComponent,
		PermissionsDirective,
		LbAutoCompleteComponent,
		DatePcikerComponent,
		PromptComponent,
		LoadingComponent,
		TextEditorComponent,
		IframeComponent

	],
	entryComponents: [DatePcikerComponent],
	imports: [

		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatRippleModule,
		MatCheckboxModule,
		MatDialogModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatRadioModule,
		MatAutocompleteModule,
		MatTabsModule,
		MatChipsModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatMenuModule,
		MatStepperModule,
		MatIconModule,
		NgxEditorModule.forRoot({
			locals: {
				// menu
				bold: 'Bold',
				italic: 'Italic',
				code: 'Code',
				blockquote: 'Blockquote',
				underline: 'Underline',
				strike: 'Strike',
				bullet_list: 'Bullet List',
				ordered_list: 'Ordered List',
				heading: 'Heading',
				h1: 'Header 1',
				h2: 'Header 2',
				h3: 'Header 3',
				h4: 'Header 4',
				h5: 'Header 5',
				h6: 'Header 6',
				align_left: 'Left Align',
				align_center: 'Center Align',
				align_right: 'Right Align',
				align_justify: 'Justify',
				text_color: 'Text Color',
				background_color: 'Background Color',

				// popups, forms, others...
				url: 'URL',
				text: 'Text',
				openInNewTab: 'Open in new tab',
				insert: 'Insert',
				altText: 'Alt Text',
				title: 'Title',
				remove: 'Remove',
			},
		})
	],
	exports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		LoadingComponent,
		MatInputModule,
		VMessageComponent,
		MatDialogModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatRadioModule,
		MatButtonModule,
		MatIconModule,
		LbAutoCompleteComponent,
		MatTabsModule,
		MatRippleModule,
		MatChipsModule,
		MatCheckboxModule,
		MatAutocompleteModule,
		PermissionsDirective,
		DatePcikerComponent,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatMenuModule,
		TextEditorComponent,
		MatStepperModule,
		IframeComponent
	],
	providers: [
		// {
		// 	provide: MatPaginatorIntl, deps: [],
		// 	useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
		// }
	]
})
export class FormControllerModule { }
