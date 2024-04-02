
import { Filter_Options, Request, Response } from '../__types';
import Validator from 'validatorjs';
import DataBase from './Database';
import { ObjectId } from 'mongodb';
/**
* @class BaseController
*/
export class BaseController extends DataBase {
	
	private errors: { [key: string]: string } = {
		permission: "You Don't have permission",
		notfound: "Data Not Found",
		invalid: "Invalid Request",
		exist: "% already Exist",
		required: "Please provide required Info",
		create: 'Unable to create %',
		update: 'Unable to update %',
		list: 'Unable to get list of %\'s',
		get: 'Unable to get %',
		cantdelete: 'Can\'t delete this %, because this % profile has been used.',
		delete: 'Can\'t delete this %, Error occurred',
		dontexist: '% doesn\'t exist',
		login: 'Please Login to continue',
		token: 'Failed to authenticate token.',
		wrong: 'Something went wrong please try again latter.',
	};
	constructor() {
		super();
		this.registerAsyncValidator();
	}
	protected json = (req: Request, res: Response, statusCode: number, ret: {data?: object | null, message?: string, token?: string, count?: any}): Response => {
		let {data, message, token, count} = ret;
		let resp = { success: true};
		if(typeof(count) != "undefined") {
			resp['pagination'] = {
				total: (count.length > 0) ? count[0].total : 0,
				...this.getPagination(req)
			}
		}
		if(data) {
			if (data["data"]) {
				resp["data"] = data["data"];
			} else {
				resp["data"] = data;
			}
			// resp = Object.assign(resp, data)
		} else {
			resp["data"] = null;
		}
		if(message) {
			resp["message"] = message;
		}
		if(token) {
			resp["token"] = token;
		}
		return res.status(statusCode).json(resp);
	}
	protected jsonError = async (res: Response, statusCode: number, component?: string, error?, exception?) => {
		if (exception) {
			console.log(exception);
		}
		if (!error) {
			return res.sendStatus(statusCode);
		}
		return res.status(statusCode).json(this.error((component ? component : ""), error));
	}
	protected error = (component: string, error) => {
		if (this.errors[error]) {
			return { success: false, error: this.errors[error].replace(/%/g, component.charAt(0).toUpperCase() + component.slice(1)) };
		} else {
			return { success: false, error: error };
		}
	}
	private getPagination = (req: Request): {page: number, page_size: number} => {
		let page = 1;
		let page_size = global['config'].pagination.page_size;
		if (req.query['page']) {
			page = parseInt(req.query['page'].toString());
		}
		if (req.query['pageSize']) {
			page_size = parseInt(req.query['pageSize'].toString());
		}

		if (page_size > global['config'].pagination.maxLimit) {
			page_size = global['config'].pagination.maxLimit;
		}
		return {page, page_size}
	}
	protected getAggrigation = (req: Request, filter_options: Filter_Options, defaultFilter: object = {}, allow:boolean=true) => {
		let {search, defaultSort, filters} = filter_options;
		const data = defaultFilter;
		req.aggregations = [];
		req.dbPagination = [];
		Object.keys(req.query).forEach(qfield => {
			let field = qfield;
			if(qfield.indexOf("__") > -1) {
				field = qfield.split("__")[0];
			}
			if(filters[qfield]) {
				const {type, filter} = filters[qfield];
				let value: any = req.query[qfield];
				if(type == "boolean") {
					value = JSON.parse(value.toLowerCase());;
				}
				if(type == 'date') {
					value = new Date(value);
					if (filter == '$lte') {
						let timeToAdd = ((23 * 3600) + 3599.999) * 1000;
						value.setTime(value.getTime() + timeToAdd);
					}
				}
				if(filter === "$in") {
					value = value.split(",");
					if(type === "int") {
						value = value.map((str) => {return parseInt(str); });
					}
					if(type=="objectId"){
						value = value.map((str) => { return new ObjectId(str); });
					}
				} else if (type === "int") {
					value = parseInt(value);
				}
				
				if (filter === "eq") {
					data[field] = value;
				} else {
					if (!data[field]) {
						data[field] = {};
					}
					data[field][filter] = value;
				}
			}
		});
		if (allow && req.user && req.user.role ) {
			if (['Super Admin','Admin'].indexOf(req.user.role.name)===-1){
				data["createdBy"] = new ObjectId(req.user._id);
			}
		}
		if (req.query["q"]) {
			const q = req.query["q"].toString();
			if (search.length > 0) {
				const se = search.map(e => {
					const se = {};
					se[e] = new RegExp(q, "gim");
					return se;
				});
				data["$or"] = se;
			}
		}
		if(Object.keys(data).length > 0) {
			req.dbPagination.push({
				$match: data,
			});
			req.aggregations.push({
				$match: data,
			});
		}
		
		
		let rawParm;
		if (req.query['orderby']) {
			rawParm = req.query['orderby'];
		} else {
			rawParm = defaultSort;
		}
		
		let order = 1;
		if (req.query['orderdir']) {
			order = parseInt(req.query['orderdir'].toString());
		}
		let sort = {};
		sort[rawParm] = order;
		req.aggregations.push({
			$sort: sort,
		});
		
		
		// Pagination
		const pagination = this.getPagination(req);
		const skip = (pagination.page - 1) * pagination.page_size;
		
		// Pagination
		req.aggregations.push({ $skip: skip }, { $limit: pagination.page_size });
		req.dbPagination.push({
			$count: "total"
		});
	}
	registerAsyncValidator = () => {
		Validator.registerAsync(
			"exist",
			function (value: string, attribute, req, passes) {
				if (!attribute)
				throw new Error(
					"Specify Requirements i.e fieldName: exist:collection,column"
					);
					let attArr = attribute.split(",");
					
					if (attArr.length !== 2)
					throw new Error(`Invalid format for validation rule on ${attribute}`);
					const { 0: collection, 1: column } = attArr;
					
					let msg =
					column == "username"
					? `${column} has already been taken `
					: `${column} already in use`;
					let query = {};
					query[column] = value;
					let projection = {};
					projection[column] = 1;
					this.collections[collection]
					?.findOne(query, { projection })
					.then((result) => {
						if (result) {
							passes(false, msg); // if username is not available
						} else {
							passes(true);
						}
					});
				},
				"Username has already been taken."
				);
			}
		}
		