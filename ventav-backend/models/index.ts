import { ObjectId } from "mongodb";
export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  roleId: ObjectId;
  role?: Role;
  createdAt: Date;
  modifiedAt: Date;
  active: boolean;
  isDeleted: boolean;
  dob?:Date;
  zipCode?:number;
}
export interface Role {
  _id: ObjectId;
  name: string;
  priority: number;
  permissions: { [key: string]: { [key: string]: boolean } };
}

export interface Country {
  _id?: ObjectId;
  name: string;
  iso3: string;
  phone_code: string;
  capital: string;
  currency: string;
}

export interface State {
  _id?: ObjectId;
  name: string;
  abbreviation: string;
}
export interface Region {
  _id?: ObjectId;
  name: string;
  stateId: ObjectId;
}
export interface Timezone {
  _id?: ObjectId;
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

export interface Setting {
  _id?: ObjectId;
  permissions: Object
}

export interface Industry {
  _id?: ObjectId;
  name: string;
  emailSubject: string;
  emailButtonText: string;
  redumptionSuccessMessage: string;
  redumptionAlreadyMessage: string;
  dealPageImages?: [];
  ticketImage?: [];
  ticketText: string;
  questions?: string[];
  imageText: string;
  active: boolean;
  isDeleted: boolean
}
export interface Firm {
  _id?: ObjectId;
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  rating: number;
  active: boolean;
  isDeleted: boolean
}
export interface EmailTemplate {
  _id: ObjectId;
  templateName: string;
  used_for: string;
  fields: { message: string, code: string }[];
}
export interface TemplateDetail{
  _id: ObjectId;
  templateId:ObjectId;
  promoterId:ObjectId;
  name:string;
  subject: string;
  message: string;
  active: boolean;
  isDeleted: boolean;
}

export interface Merchant {
  _id: ObjectId;
  promoterId: ObjectId;
  name: string;
  street: string;
  city: string;
  stateId: ObjectId;
  zipCode: number;
  email: string;
  stateIds: [ObjectId];
  regionIds: [ObjectId];
  industryId: ObjectId;
  phone: string;
  position: string;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPassword: string;
  merchantText: string;
  notes: string;
  website: string;
  revenue: number;
  emailRemainingTimes: number;
  communicationEmail: string;
  language: string;
  active: boolean;
  isDeleted: boolean;
}

export interface Deal {
  _id: ObjectId;
  promoterId: ObjectId;
  firm: ObjectId;
  dealName: string;
  dealNumber: number;
  dealSiteLink: string;
  offerStartDate: Date;
  offerEndDate: Date;
  couponExpiryDate: Date;
  customerPrice: number;
  dailyFirmPortion: number;
  charity: number;
  representative: string;
  discount: number;
  dealType: string;
  industryIds: [ObjectId];
  industryDetails: dealDetails[];
  stateIds: [ObjectId];
  regionIds: [ObjectId];
  merchantIds: [ObjectId];
  hideExpiryDate: boolean;
  frenchEmail: boolean;
  germanEmail: boolean;
  dealSpecificEmail: boolean;
  startNotification: boolean;
  inHouseDeal: boolean;
  notificationLanguage?: string;
  sortBy: string;
  ticketType: string;
  emailCC: string;
  checkoutText: string;
  checkoutLogo: string;
  active: boolean;
  isDeleted: boolean;
}

export interface dealDetails {
  industryId: ObjectId;
  description: string;
  quantity:number;
  industryPortion:number;
  unit: string;
  expiryDate: Date;
}

export interface Coupon {
  _id: ObjectId;
  dealId: ObjectId;
  couponCode: string;
  email: string;
  name: string;
  dob: Date;
  survey: string;
  redeemOnline: boolean;
  stateIds: ObjectId[];
  regionIds: ObjectId[];
  isDeleted:boolean
}

export interface Ticket {
  _id: ObjectId;
  ticketNumber:string;
  couponCode: string;
  couponId: ObjectId;
  industryId: ObjectId;
  dealId: ObjectId;
  isDeleted: boolean
}