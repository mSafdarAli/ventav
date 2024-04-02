import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core";

export default class UserController extends BaseController {
	public __component: string = "settings";
	private filter_options: Filter_Options = {
		search: ["name", "email"],
		defaultSort: "createdAt",
		filters: {},
	};
	public permissions = async (req: Request, res: Response): Promise<Response> => {
		try {
			let result;
			result = await this.collections.settings.find({},{projection:{permissions:1}}).toArray()
			result = result[0]
			return this.json(req, res, 200, { data:result.permissions});
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}