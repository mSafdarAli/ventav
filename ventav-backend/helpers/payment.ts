import { APIContracts, APIControllers } from "authorizenet";
import config from "../config/config";

export default class Payment {
	public async paymentIntent(data: any) {
		const {
			expiryMonth,
			expiryYear,
			cardNumber,
			securityCode,
			firstName,
			lastName,
			address,
			city,
			zipCode,
			amount
		} = data;
		const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
		merchantAuthenticationType.setName(config.authorized_payment.apiLoginKey);
		merchantAuthenticationType.setTransactionKey(config.authorized_payment.transactionKey);

		const creditCard = new APIContracts.CreditCardType();
		const formattedExpireDate = expiryMonth + expiryYear;
		creditCard.setCardNumber(cardNumber);
		creditCard.setExpirationDate(formattedExpireDate);
		creditCard.setCardCode(securityCode);

		const paymentType = new APIContracts.PaymentType();
		paymentType.setCreditCard(creditCard);

		const billTo = new APIContracts.CustomerAddressType();
		billTo.setFirstName(firstName);
		billTo.setLastName(lastName);
		// billTo.setCompany(companyName);
		billTo.setAddress(address);
		billTo.setCity(city);
		billTo.setZip(zipCode);
		billTo.setCountry("USA");

		const transactionSetting2 = new APIContracts.SettingType();
		transactionSetting2.setSettingName('recurringBilling');
		transactionSetting2.setSettingValue('false');

		const transactionSettingList: any[] = [];
		// transactionSettingList.push(transactionSetting1);
		transactionSettingList.push(transactionSetting2);

		const transactionSettings = new APIContracts.ArrayOfSetting();
		transactionSettings.setSetting(transactionSettingList);

		const transactionRequestType = new APIContracts.TransactionRequestType();
		transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
		transactionRequestType.setPayment(paymentType);
		transactionRequestType.setAmount(amount);
		// transactionRequestType.setLineItems(lineItems);
		// transactionRequestType.setUserFields(userFields);
		// transactionRequestType.setOrder(orderDetails);
		// transactionRequestType.setTax(tax);
		// transactionRequestType.setDuty(duty);
		// transactionRequestType.setShipping(shipping);
		transactionRequestType.setBillTo(billTo);
		// transactionRequestType.setShipTo(shipTo);
		transactionRequestType.setTransactionSettings(transactionSettings);

		const createRequest = new APIContracts.CreateTransactionRequest();
		createRequest.setMerchantAuthentication(merchantAuthenticationType);
		createRequest.setTransactionRequest(transactionRequestType);

		//pretty print request
		console.log(JSON.stringify(createRequest.getJSON(), null, 2));

		const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
		
		//Defaults to sandbox
		// ctrl.setEnvironment(config.authorized_payment.productionURL);
		return new Promise((resolve, reject) => {
			ctrl.execute(() => {
				const apiResponse = ctrl.getResponse();
				const response = new APIContracts.CreateTransactionResponse(apiResponse);
				/*For Subscription */
				// const response = new APIContracts.ARBUpdateSubscriptionResponse(apiResponse);
				if (response !== null) {
					if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
						resolve({success: true, message: response.getMessages().getResultCode()});
					} else {
						let messageArray = response.getMessages().getMessage().map(e => e.getText());
						resolve({ success: false, message: messageArray.join("---:---") });
						// resolve(new Error(response.getMessages().getMessage()[0].getText()));
					}
				} else {
					reject(new Error("Null response"));
				}
			});
		});
	}
}
// const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
// merchantAuthenticationType.setName(config.authorized_payment.apiLoginKey);
// merchantAuthenticationType.setTransactionKey(config.authorized_payment.transactionKey);



/* Information related to subscription */

// const interval = new APIContracts.PaymentScheduleType.Interval();
// interval.setLength(1);
// interval.setUnit(APIContracts.ARBSubscriptionUnitEnum.MONTHS);

// const paymentScheduleType = new APIContracts.PaymentScheduleType();
// paymentScheduleType.setInterval(interval);
// paymentScheduleType.setStartDate("today");
// paymentScheduleType.setTotalOccurrences("9999"); // ongoing occurrence
// paymentScheduleType.setTrialOccurrences("2");

// const creditCard = new APIContracts.CreditCardType();
// const formattedExpireDate = params.expiryMonth + params.expiryYear;
// creditCard.setCardNumber(params.cardNumber);
// creditCard.setExpirationDate(formattedExpireDate);
// creditCard.setCardCode(params.securityCode);

// const paymentType = new APIContracts.PaymentType();
// paymentType.setCreditCard(creditCard);

/* Information related to credit card */

// const orderType = new APIContracts.OrderType();

// const tax = new APIContracts.ExtendedAmountType();
// tax.setAmount('4.26');
// tax.setName('level2 tax name');
// tax.setDescription('level2 tax');

// const duty = new APIContracts.ExtendedAmountType();
// duty.setAmount('8.55');
// duty.setName('duty name');
// duty.setDescription('duty description');

// const shipping = new APIContracts.ExtendedAmountType();
// shipping.setAmount('8.55');
// shipping.setName('shipping name');
// shipping.setDescription('shipping description');

/* Not required*/
// const customer = new APIContracts.CustomerType();
// customer.setEmail(params.username);
// customer.setPhoneNumber(params.phoneNumber);
// customer.setTaxId(params.federalTaxId);


// const billTo = new APIContracts.CustomerAddressType();
// billTo.setFirstName(params.firstName);
// billTo.setLastName(params.lastName);
// billTo.setCompany(params.companyName);
// billTo.setAddress(params.address);
// billTo.setZip(params.zipCode);
// billTo.setCountry("USA");

/*Don't know if I need these */
// const transactionSetting1 = new APIContracts.SettingType();
// transactionSetting1.setSettingName('duplicateWindow');
// transactionSetting1.setSettingValue('120');

// const transactionSetting2 = new APIContracts.SettingType();
// transactionSetting2.setSettingName('recurringBilling');
// transactionSetting2.setSettingValue('false');

// const transactionSettingList: any[] = [];
// // transactionSettingList.push(transactionSetting1);
// transactionSettingList.push(transactionSetting2);

// const transactionSettings = new APIContracts.ArrayOfSetting();
// transactionSettings.setSetting(transactionSettingList);

/*For Card Payment */
// const transactionRequestType = new APIContracts.TransactionRequestType();
// transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
// transactionRequestType.setPayment(paymentType);
// transactionRequestType.setAmount(132);
// // transactionRequestType.setLineItems(lineItems);
// // transactionRequestType.setUserFields(userFields);
// // transactionRequestType.setOrder(orderDetails);
// // transactionRequestType.setTax(tax);
// // transactionRequestType.setDuty(duty);
// // transactionRequestType.setShipping(shipping);
// transactionRequestType.setBillTo(billTo);
// // transactionRequestType.setShipTo(shipTo);
// transactionRequestType.setTransactionSettings(transactionSettings);


/* For Subscription request*/
// const arbSubscription = new APIContracts.ARBSubscriptionType();
// arbSubscription.setName("subscription");
// arbSubscription.setPaymentSchedule(paymentScheduleType);
// arbSubscription.setAmount("10.00");
// arbSubscription.setTrialAmount("0.00");
// arbSubscription.setPayment(payment);
// arbSubscription.setOrder(orderType);
// arbSubscription.setCustomer(customer);
// arbSubscription.setBillTo(billTo);
// arbSubscription.setShipTo(billTo);

// const cardType = APIContracts.ARBGetSubscriptionListOrderFieldEnum.ACCOUNTNUMBER;

// const createRequest = new APIContracts.CreateTransactionRequest();
// createRequest.setMerchantAuthentication(merchantAuthenticationType);
// createRequest.setTransactionRequest(transactionRequestType);


//pretty print request
// console.log(JSON.stringify(createRequest.getJSON(), null, 2));

// var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
//Defaults to sandbox
// ctrl.setEnvironment(config.authorized_payment.productionURL);

/*For Subscription */
// const ctrl = new APIControllers.ARBCreateSubscriptionController(createRequest.getJSON());
// ctrl.setEnvironment(Constants.endpoint.production);

// new Promise((resolve, reject) => {
// 	ctrl.execute(() => {
// 		const apiResponse = ctrl.getResponse();
// 		var response = new APIContracts.CreateTransactionResponse(apiResponse);
// 		/*For Subscription */
// 		// const response = new APIContracts.ARBUpdateSubscriptionResponse(apiResponse);
// 		if (response !== null) {
// 			if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
// 				resolve(response.getMessages().getResultCode());
// 			} else {
// 				reject(new Error(response.getMessages().getMessage()[0].getText()));
// 			}
// 		} else {
// 			reject(new Error("Null response"));
// 		}
// 	});
// });