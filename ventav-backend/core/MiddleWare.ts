import config from '../config/config';
import { BaseController } from './';
import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from '../__types';
import { User } from '../models';
import { ObjectId } from 'mongodb';

export class MiddleWare extends BaseController {
	
	public crosHeaders = (req: Request, res: Response, next: NextFunction) => {
		// Website you wish to allow to connect
		const origin = req.headers.origin;
		if (typeof origin == 'string') {
			// if (config.allowedDomains.indexOf(origin) > -1) {
				res.setHeader('Access-Control-Allow-Origin', origin);
			// }
			
			// Request methods you wish to allow
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			
			// Request headers you wish to allow
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization, Authorization');
			
			// Set to true if you need the website to include cookies in the requests sent
			// to the API (e.g. in case you use sessions)
			res.setHeader('Access-Control-Allow-Credentials', "true");
			
			// Pass to next layer of middleware
		}
		next();
	}
	
	public TokenValidator = (req: Request, res: Response, next: NextFunction) => {
		const token = this.getToken(req);
		if (req.method === 'OPTIONS') {
			res.sendStatus(200);
			return;
		}
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, config.secret, (err, decoded: any) => {
				if (err) {
					return res.status(401).json(this.error('auth', 'token'));
				}
				this.collections.users
					?.aggregate([
						{ $match: { _id: new ObjectId(decoded._id) } },
						{
							$lookup: {
								from: "roles",
								localField: "roleId",
								foreignField: "_id",
								as: "role",
							},
						},
						{
							$project: {
								id: 1,
								name: 1,
								email: 1,
								roleId: 1,
								password: 1,
								salt: 1,
								role: {$arrayElemAt:["$role",0]},
							},
						},
					])
					.toArray().then((result: User[]) => {
						if (result) {
							req.user = result[0];
							next();
						} else {
							return res.status(401).json(this.error('auth', 'login'));
						}
					});
			});
		} else {
			// if there is no token
			// return an error
			return res.status(401).json(this.error('auth', 'login'));
		}
	}
	
	private getToken = (req: Request): string | null => {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return req.headers.authorization.split(' ')[1];
		}
		return null;
	}
	
	// Example
	// { path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: 'comments', permission: 'view all' },
	public permission = (component: string, permission: string) => {
		return async (req, res, next) => {
			try {
				if (req.user) {
					if (req.user.role?.permissions[component] && req.user.role?.permissions[component][permission] == true) {
						next();
					} else {
						return res.status(401).json(this.error('auth', 'permission'));
					}
				} else {
					return res.status(401).json(this.error('auth', 'login'));
				}
			} catch (error) {
				next(error);
			}
		}
	}
}