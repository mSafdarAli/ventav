import { ObjectId } from "mongodb";

export const templates = [
	{
		_id: new ObjectId(),
		templateName: "New Merchant",
		fields: [
			{ message: "Company", code: "{%company%}" },
			{ message: "User's New Email", code: "{%user email%}" },
			{ message: "User's Temporary Password", code: "{%password%}" },
		],
		name: "New Merchant Email",
		used_for: "new_merchant",
		subject: "Your {%company%} Account Information",
		message: 'Thank you for participating with {%company%} marketing program. We look forward to our mutual success and building a long-term relationship. Below is your user ID and temporary password for redeeming the tickets that come into your venue. You will be able to track the deals we have run and how many where redeemed at your field once they are redeemed. This will give you a great tool to track the deals that are bringing you in the most customers as well as the type of clientele each site is attracting. We will send you a email shortly with future feature dates to get ready for. We will also check in with you prior to the deal running to make sure all your questions are answered and everyone is ready to go. Once a deal runs people will be calling to verify prices and make a reservation. When they arrive they will present a {%company%} Voucher with a code on it. User ID: {%user email%} Temporary Password: {%password%} If you have any questions please give me a call. Thank You, {%company%}',
		active: true,
		isDeleted:false,
	},
	{
		_id: new ObjectId(),
		templateName: "Consumer Redeems Coupon",
		fields: [
			{ message: "The Buyer's Name", code: "{%user%}" },
			{ message: "The Link to the Tickets", code: "{%link%}" },
			{ message: "The Company's Email", code: "{%company email%}" },
			{ message: "Company", code: "{%company%}" },
		],
		name: "Coupon Redeem Email",
		used_for: "consumer_redeems_coupon",
		subject: "Your Paintball Tickets",
		message: 'Hello {%user%}, Thank you for your purchase of your tickets. Please click the link below, then print your tickets and redeem them at any of the venues listed on the ticket. {%link%} Any questions, just drop us a note at {%company email%}. Enjoy your experience! Yours truly, {%company%}',
		active: true,
		isDeleted:false,
	},
	{
		_id: new ObjectId(),
		templateName: "Deal Start Notification",
		fields: [
			{ message: "Contact Name for Locations", code: "{%contact name%}" },
			{ message: "Deal Firm", code: "{%firm%}" },
			{ message: "Offer Start Date", code: "{%offer start date%}" },
			{ message: "Offer End Date", code: "{%offer end date%}" },
			{ message: "Deal Description", code: "{%deal description%}" },
			{ message: "Customer Price", code: "{%customer price%}" },
		],
		name: "Notification Email",
		used_for: "deal_notification",
		subject: "Deal About to Be Run",
		message: 'Hello {%contact name%}, Quick reminder! Our deal through {%firm%} will run from {%offer start date%} to {%offer end date%}. The description of the deal is {%deal description%}. The price to customers is {%customer price%}. We look forward to the deal being a success for you and bringing you new customers.',
		active: true,
		isDeleted:false,
	},
	{
		_id: new ObjectId(),
		templateName: "Deal Completion",
		fields: [
			{ message: "Contact Name for Locations", code: "{%contact name%}" },
			{ message: "Deal Firm", code: "{%firm%}" },
		],
		name: "Deal End Email",
		used_for: "deal_completion",
		subject: "Deal is Completing",
		message: 'Hello {%contact name%}, Thank you for participating in our recent Deal with {%firm%}.',
		active: true,
		isDeleted:false,
	}
]