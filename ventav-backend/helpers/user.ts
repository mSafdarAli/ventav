import { Request } from "../__types";

export default class UserHelper {
  static hasPermissions = (
    req: Request,
    component: string,
    permission: string
  ): boolean => {
    if (
      req.user.role?.permissions[component] &&
      req.user.role?.permissions[component][permission] == true
    ) {
      return true;
    }
    return false;
  };

  // static logEvent = async (event: string, user_id: number | null = null): Promise<void> => {
  // 	if (user_id || global['user']) {
  // 		if (global['user']) {
  // 			user_id = global['user'].id;
  // 		}
  // 		await UserLog.create({
  // 			user_id: user_id,
  // 			event: event
  // 		});
  // 	}
  // }

  // static sendVerification = async (code, verification_bit) => {
  // 	await UserVerification.create({
  // 		code: code,
  // 		verification_bit: verification_bit,
  // 		expire: moment().add(2, 'hours')
  // 	});
  // }
}
