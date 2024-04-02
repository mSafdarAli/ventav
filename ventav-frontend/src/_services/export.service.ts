import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
	providedIn: 'root'
})

export class ExportService {

	constructor() { }

	exportCoupons(data: any[]) {
		const filtered = data?.map(obj => {
			const { _id, ...rest } = obj;
			return rest
		});
		this.jsonToCSV(filtered, "Coupons" + Date.now());
	}

	jsonToExcelSheet(data: any[], file_name = 'temp.xlsx') {

		const workBook = XLSX.utils.book_new(); // create a new blank book
		const workSheet = XLSX.utils.json_to_sheet(data);
		let wscols = [{ wpx: 150 }, { wpx: 200 }, { wpx: 150 }, { wpx: 150 }];
		workSheet['!cols'] = wscols; // set cell width
		XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
		return XLSX.writeFile(workBook, file_name); // initiate a file download in browser

	}


	jsonToCSV(data: any[], file_name = 'temp') {

		const workBook = XLSX.utils.book_new(); // create a new blank book
		const workSheet = XLSX.utils.json_to_sheet(data);

		XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
		return XLSX.writeFile(workBook, `${file_name}.csv`); // initiate a file download in browser

	}




}