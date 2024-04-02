import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core";

export default class UserController extends BaseController {
  public __component: string = "users";
  private filter_options: Filter_Options = {
    search: ["name", "email"],
    defaultSort: "createdAt",
    filters: {},
  };
  public me = async (req: Request, res: Response): Promise<Response> => {
    try {
      let data;
      const defaultFilter = { _id: req.user._id };
      this.getAggrigation(req, this.filter_options, defaultFilter,false);
      [data] = await Promise.all([
        this.collections.users.aggregate([
          ...req.aggregations,
          {
            $lookup: {
              from: "roles",
              localField: "roleId",
              foreignField: "_id",
              as: "role"
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              role: { $arrayElemAt: ["$role", 0] }
            },
          }
        ]).toArray(),
      ]);
      data = data[0]
      return this.json(req, res, 200, { data });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const defaultFilter = { _id: new ObjectId(id) };
      const user = await this.collections.users.findOne(defaultFilter,
        {
          projection: {
            _id: 1,
            name: 1,
            email: 1,
            roleId: 1,
            timezone: 1,
            createdAt: 1,
            modifiedAt: 1,
            active: 1
          }
        });
      if (user) {
        return this.json(req, res, 200, { data: user });
      }
      return this.jsonError(res, 400, this.__component, "get");
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
  public list = async (req: Request, res: Response): Promise<Response> => {
    try {
      const defaultFilter = { isDeleted: false };
      if (req.user.email != "admin@loopbrackets.com") {
        defaultFilter['email'] = { $nin: ["admin@loopbrackets.com", req.user.email] }
      }
      this.getAggrigation(req, this.filter_options, defaultFilter);
      const [data, count] = await Promise.all([
        this.collections.users.aggregate([
          ...req.aggregations,
          {
            $lookup: {
              from: "roles",
              localField: "roleId",
              foreignField: "_id",
              as: "role"
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              role: { $arrayElemAt: ["$role.name", 0] },
              createdAt: 1,
              modifiedAt: 1,
              active: 1
            },
          }
        ]).toArray(),
        this.collections.users.aggregate(req.dbPagination).toArray(),
      ]);
      return this.json(req, res, 200, { data, count: count });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
  public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      console.log(id)
      const Validationrules = {
        name: global["config"].commonRules.name,
        password: global["config"].commonRules.password.push("confirmed"),
        email: global["config"].commonRules.email,
        active: "required",
        roleId: 'required'
      };
      const formErrors = await this.validateForm(req.body, Validationrules);
      console.log(formErrors)
      const FormBody = this.getFormFields(req.body, Validationrules);
      FormBody.isDeleted = false
      // FormBody.active = (FormBody.active == 'true') ? true : false
      if (!formErrors) {
        if (!id) {
          const existingUser = await this.collections.users.findOne({
            email: FormBody.email,
          });
          if (existingUser) {
            return this.jsonError(
              res,
              400,
              this.__component,
              "Email already Exists"
            );
          }
        }
        const password = this.passwordEn(FormBody.password);
        if (id) {
          delete FormBody.password
          await this.collections.users.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, roleId: new ObjectId(FormBody.roleId) } });
        } else {
          await this.collections.users.insertOne({ ...FormBody, ...password, roleId: new ObjectId(FormBody.roleId) });
        }
        return this.json(req, res, 200, {
          message: `User ${(id) ? 'Updated' : 'Created'} Successfully`
        });
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 400, this.__component, "wrong", error);
    }
  };
  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (id) {
        await this.collections.users.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
        return this.json(req, res, 200, { message: `User Deleted Successfully` });
      } else {
        return this.jsonError(res, 400, this.__component, 'delete');
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
}
