import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
	selector: 'pagination-master',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
	@Input() params: Params;
	@Input() meta: {
		current_page: number;
		from: number;
		last_page: number;
		path: number;
		per_page: number;
		to: number;
		total: number;
	};
	per_page: string = "25";
	queryParams: Params;
	constructor(private router: Router, private _route: ActivatedRoute) {
		this.queryParams = Object.assign({}, this.params)
	}
	ngOnChanges(changes: SimpleChanges) {
		const change = changes['params'];
		if (change && change.currentValue) {
			this.queryParams = Object.assign({}, this.params)
		}
	}
	changePage(page) {
		if (page > 0 && this.meta && page <= this.meta.last_page) {
			this.queryParams['page'] = page
			this.changeRoute();
		}
	}
	changePageSize(per_page) {
		this.queryParams['page'] = 1
		this.queryParams['page_size'] = per_page
		this.changeRoute();
	}
	changeRoute() {
		this.router.navigate([], {
			relativeTo: this._route,
			queryParams: this.queryParams,
			queryParamsHandling: 'merge',
			skipLocationChange: false
		});
	}
}
