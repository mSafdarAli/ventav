
import { ObjectId } from "mongodb";
import { BaseController } from "../core";

export default class IdGenerater extends BaseController {

	public dealId = async () => {
		const deals = await this.collections.deals.countDocuments();
		if (deals > 0) {
			return this.pad(deals + 1, 5);
		} else {
			return this.pad(1, 5);
		}
	}
	public coupons = async (start, length, alphanumeric) => {
		let len;
		if (typeof start == 'string' && length != 0) {
			len = (start) ? (length - start.length) : length
		} else if (length == 0) {
			len = 8
		} else {
			len = (start) ? (length - start) : length
		}
		const code = this.randomNumbers(len, alphanumeric)
		return code;
	}


	private randomNumbers = (length, noOnly = true): string => {
		let result = "";
		let characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		if (!noOnly) {
			characters = "0123456789";
		}
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	};

	private romanize(num: number) {
		const roman = {
			M: 1000,
			CM: 900,
			D: 500,
			CD: 400,
			C: 100,
			XC: 90,
			L: 50,
			XL: 40,
			X: 10,
			IX: 9,
			V: 5,
			IV: 4,
			I: 1
		};
		let str = '';

		for (const i of Object.keys(roman)) {
			const q = Math.floor(num / roman[i]);
			num -= q * roman[i];
			str += i.repeat(q);
		}

		return str;
	}

	private pad(n, width, z = '') {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}


}