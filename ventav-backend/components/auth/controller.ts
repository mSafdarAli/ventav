import { Request, Response } from "../../__types";
import { BaseController } from "../../core";

export default class AuthController extends BaseController {
  public __component: string = "auth";
  public login = async (req: Request, res: Response): Promise<Response> => {
    const FormBody: { email: string; password: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });
    if (user) {
      if(user.active){
        const password = this.passwordEn(FormBody.password, user.salt);
        if (password.password === user.password) {
          const data = { _id: user._id, name: user.name, email: user.email, roleID: user.roleId };
          const token = this.signJwt(data);
          return this.json(req, res, 200, {data, message: "Login Successfully", token});
        }
      }else{
        return this.jsonError(res, 400, this.__component, "Access is revoked");
      }
    }
    return this.jsonError( res, 400, this.__component, "Login information is wrong" );
  };

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const Validationrules = {
        name: global["config"].commonRules.name,
        password: global["config"].commonRules.password.push("confirmed"),
        email: global["config"].commonRules.email,
        terms: "required",
      };
      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      if (!formErrors) {
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
        const password = this.passwordEn(FormBody.password);
        const role = await this.collections.roles.findOne({ name: "User" });
        if (role) {
          FormBody["roleId"] = role._id;
        }
        await this.collections.users.insertOne({ ...FormBody, ...password });
        return this.json(req, res, 200, {message: "Registered Successfully"});
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 400, this.__component, "wrong", error);
    }
  };

  public forgetPassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const FormBody: { email: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });
    if (user) {
      // let message_subject = 'Reset Password';
      // const html =  '<body> Password Reset Link <a href="/resetPassword">Click to Reset Your Password</body>';
      // const mailOptions = {
      //   from: 'lovelaunch.com',
      //   to: 'FormBody.email',
      //   subject: message_subject,
      //   text: html
      // };
      // const email = new EmailHelper();
      // await email.sendEmailUsingSendGrid(mailOptions);
      return this.json(
        req,
        res,
        200,
        {message: "Check your Email"}
      );
    }
    return this.jsonError(res, 400, this.__component, "Email is incorrect");
  };
  public resetPassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const FormBody: { email: string; confirm_password: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });
    if (user) {
      const password = this.passwordEn(FormBody.confirm_password, user.salt);
      await this.collections.users.updateOne({ _id: user._id }, { $set: password });
      return this.json(req, res, 200, {message: "Password updates successfully"});
    }
    return this.jsonError(
      res,
      400,
      this.__component,
      "Password is not updated"
    );
  };
}
