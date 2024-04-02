import { Collection, Db, ObjectId } from "mongodb";
import { Country, Region, Role, State, Timezone, User, Setting, Industry, Firm, EmailTemplate, Merchant, Deal, TemplateDetail, Coupon, Ticket } from "../models";
import Utility from "../helpers/utility";
import { roles } from "./seed/roles";
import { country_list } from "./seed/countries_list";
import { state_list } from "./seed/states_regions_list";
import { timezone_list } from "./seed/timezone_list";
import { permissions } from "./seed/permissions";
import { Database } from "../database/db";
import { templates } from "./seed/email_templates";
const tables = ['users', 'countries', 'roles', 'states', 'regions', 'timezones', 'settings', 'industries', 'firms', 'emailTemplates', 'templateDetails', 'merchants', 'deals', 'coupons', 'tickets'];
export default class DataBase extends Utility {
	private db: Db;
	protected collections: {
		users: Collection<User>,
		countries: Collection<Country>,
		roles: Collection<Role>,
		states: Collection<State>,
		regions: Collection<Region>,
		timezones: Collection<Timezone>,
		settings: Collection<Setting>,
		industries: Collection<Industry>,
		firms: Collection<Firm>,
		emailTemplates: Collection<EmailTemplate>,
		templateDetails: Collection<TemplateDetail>,
		merchants: Collection<Merchant>,
		deals: Collection<Deal>,
		coupons: Collection<Coupon>
		tickets: Collection<Ticket>
	};
	constructor() {
		super();
		if (Database.db && !this.db) {
			this.db = Database.db;
			let c: any = {};
			tables.forEach((collection) => {
				c[collection] = this.db.collection(collection);
			})
			this.collections = c;
			this.syncDB();
		}
	}
	private syncDB = async () => {

		if (global['config']['syncDb'] && global['syncDb'] == true) {
			global['syncDb'] = false;
			this.db.dropDatabase();
			let d = new Date();
			let states: State[] = [];
			let regions: Region[] = [];
			let email_templates: EmailTemplate[] = [];
			let templateDetails: TemplateDetail[] = [];
			let settings: Setting[] = permissions;
			let users: User[] = [
				{ _id: new ObjectId(), name: "Super Admin", email: "admin@loopbrackets.com", roleId: roles[0]._id, ...this.passwordEn("Test@123"), createdAt: d, modifiedAt: d, isDeleted: false, active: true },
				{ _id: new ObjectId(), name: "Promoter", email: "promoter@gmail.com", roleId: roles[2]._id, ...this.passwordEn("Test@123"), createdAt: d, modifiedAt: d, isDeleted: false, active: true }
			];
			state_list.forEach(el => {
				states.push({ _id: el._id, name: el.name, abbreviation: el.abbreviation })
				el.region.forEach(e => {
					regions.push({ _id: new ObjectId(), name: e.name, stateId: el._id })
				})
			});
			templates.forEach(el => {
				email_templates.push({ _id: el._id, templateName: el.templateName, fields: el.fields, used_for: el.used_for })
				templateDetails.push({ _id: new ObjectId(), templateId: el._id, name: el.name, subject: el.subject, message: el.message, active: true, isDeleted: false, promoterId: users[1]._id })
			})

			await this.collections.roles.insertMany(roles);
			await this.collections.users.insertMany(users);
			await this.collections.countries.insertMany(country_list);
			await this.collections.states.insertMany(states);
			await this.collections.regions.insertMany(regions);
			await this.collections.timezones.insertMany(timezone_list);
			await this.collections.settings.insertMany(settings);
			await this.collections.emailTemplates.insertMany(email_templates);
			await this.collections.templateDetails.insertMany(templateDetails);
			console.log('Data is seeded');
		}
	}
}