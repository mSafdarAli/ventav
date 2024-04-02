import { BaseController } from "../../core";
import { Filter_Options, Request, Response } from '../../__types';
import Payment from "../../helpers/payment";


export default class DealController extends BaseController {
	public __component: string = "payments";
	private filter_options: Filter_Options = {
		search: ["name", "email"],
		defaultSort: "_id",
		filters: {

		},
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			return this.json(req, res, 200, { data: {} });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public makePayment = async (req: Request, res: Response): Promise<Response> => {
		try {
			const Validationrules = {
				expiryMonth: 'required',
				expiryYear: 'required',
				cardNumber: 'required',
				securityCode: 'required',
				firstName: global["config"].commonRules.name,
				lastName: global["config"].commonRules.name,
				address: global["config"].commonRules.address,
				city: global["config"].commonRules.name,
				zipCode: 'required',
				dealId: global["config"].commonRules.id,
				ticketQuantity: 'required',
				stateIds: 'required',
				regionIds: 'required',
				email: global["config"].commonRules.email,
				phone: global["config"].commonRules.phone,
				dob: global["config"].commonRules.date,
				cardType: global["config"].commonRules.name,
				stateId: global["config"].commonRules.id,
				amount: 'required'
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			if (!formErrors) {
				const payment = new Payment();
				const result = await payment.paymentIntent(FormBody);
				console.log(result, "here")
				// await this.collections.merchants.insertOne({ ...FormBody, ...addFields });
				return this.json(req, res, 200, { message: `success` });
			}
			else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}