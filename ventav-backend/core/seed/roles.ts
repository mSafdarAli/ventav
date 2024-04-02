import { ObjectId } from "mongodb";
import { Role } from "../../models";

export const roles: Role[] = [
  {
    _id: new ObjectId(),
    name: "Super Admin",
    priority: 1,
    permissions: {
      dashboard: {
        view: true,
      },
      user: {
        get: true,
        list: true,
        me: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      role: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
        assignPermissions: true,
      },
      permission: {
        list: true,
        add: true,
        view: true,
      },
      state: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      country: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      region: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      industry: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      dealFirm: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      lookup: {
        list: true
      },
      masterdata: {
        view: true
      },
      emailTemplate: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      adminTemplate: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      merchant: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      deal: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      coupon: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
        export: true
      },
      ticket: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      customer: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
    },
  },
  {
    _id: new ObjectId(),
    name: "Admin",
    priority: 2,
    permissions: {
      dashboard: {
        view: true,
      },
      user: {
        get: true,
        list: true,
        me: true,
        update: true,
        delete: true,
        add: true,
        all: false,
      },
    },
  },
  {
    _id: new ObjectId(),
    name: "Promoter",
    priority: 3,
    permissions: {
      dashboard: {
        view: true,
      },
    },
  },
  {
    _id: new ObjectId(),
    name: "Merchant",
    priority: 4,
    permissions: {
      dashboard: {
        view: true,
      },
    },
  },
  {
    _id: new ObjectId(),
    name: "Customer",
    priority: 1,
    permissions: {},
  }
];
