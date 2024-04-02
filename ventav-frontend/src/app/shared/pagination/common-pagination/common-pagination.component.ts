import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router, Params } from '@angular/router';
import { Pagination } from 'src/_models/pagination';


@Component({
	selector: 'pagination-control',
	templateUrl: './common-pagination.component.html',
	styleUrls: ['./common-pagination.component.scss']
})
export class CommonPaginationComponent implements OnInit, OnChanges {
	@Input() params: Params;
	@Input() pager: Pagination;
	@Input() cardBox: Boolean = true;
	@Input() page_n: string = 'page';
	queryParams: Params;
	page_size = "25";
	
	constructor(private router: Router) {
		
	}
	ngOnChanges(changes: SimpleChanges) {
		const change = changes['params'];
		if (change && change.currentValue) {
			this.queryParams = Object.assign({}, this.params)
		}
	}
	ngOnInit() {
		this.queryParams = Object.assign({}, this.params)
		if (this.queryParams['page_size']) {
			this.page_size = this.queryParams['page_size'];
		}
	}
	changePage(page, p = 0) {
		if (parseInt(page) + p > 0 && parseInt(page) + p <= this.lastPage()) {
			this.queryParams[this.page_n] = parseInt(page) + p
			this.changeRoute();
		}
	}
	changePageSize(page_size) {
		this.queryParams[this.page_n] = 1
		this.queryParams['page_size'] = parseInt(page_size)
		this.changeRoute();
	}
	lastPage() {
		return parseInt(this.pager.total.toString()) ? Math.ceil(parseInt(this.pager.total.toString()) / parseInt(this.pager.page_size.toString())) : 0;
	}
	changeRoute() {
		this.router.navigate([], { queryParams: this.queryParams });
	}
}
