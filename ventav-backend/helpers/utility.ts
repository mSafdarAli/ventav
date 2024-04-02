// Not meant to be used for database related items.
import moment from "moment";
import fs from "fs";
import config from "../config/config";
import Validator from "validatorjs";
import jwt from "jsonwebtoken";
const saltedSha256 = require("salted-sha256");
export default class Utility {

  public signJwt = (data: any): string => {
    return jwt.sign(data, config.secret, {
      expiresIn: config.tokenLife,
    });
  }

  public dir = (path): Promise<string> => {
    const dest = global["appRoot"] + global["config"].uploads.path + path;
    fs.mkdirSync(dest, { recursive: true });
    return dest;
  };

  public async uploadFile(file, types: string[], path, extraVar = "") {
    if (file) {
      const originalFileName = file.file[0].originalname.split(".");
      const ext = originalFileName[originalFileName.length - 1];
      if (types.indexOf(ext) === -1) {
        return null;
      }
      const dest = this.dir(path);
      const fileName =
        (extraVar ? extraVar + "_" : "") +
        this.randomString(10) +
        moment().format("x") +
        "." +
        ext;
      fs.renameSync(file.file[0].path, dest + fileName);
      return global["config"].uploads.path + path + fileName;
    }
  }
  public async uploadFiles(file, types: string[], path, extraVar = "") {
    if (file.length > 0) {
      let images: any[] = [];
      file.forEach(el => {
        const originalFileName = el.originalname.split(".");
        const ext = originalFileName[originalFileName.length - 1];
        if (types.indexOf(ext) === -1) {
          return null;
        }
        const dest = this.dir(path);
        const fileName =
          (extraVar ? extraVar + "_" : "") +
          this.randomString(10) +
          moment().format("x") +
          "." +
          ext;
        fs.renameSync(el.path, dest + fileName);
        images.push(global["config"].uploads.path + path + fileName);
      });
      return images;
    }
  }

  public uploadBase64File = (base64Image, dir, extraVar = "") => {
    base64Image = base64Image.split(";base64,");
    let filePath;
    if (base64Image.length === 2) {
      const ext = base64Image[0].split("/").pop();
      const dest = this.dir(dir);
      const fileName =
        (extraVar ? extraVar + "_" : "") +
        this.randomString(10) +
        moment().format("x") +
        "." +
        ext;
      filePath = global["config"].uploads.path + dir + fileName;
      fs.writeFileSync(dest + fileName, base64Image[1], { encoding: "base64" });
    } else {
      filePath = base64Image[0];
    }
    return filePath;
  };

  public deleteFile(path) {
    const fullpath = global["appRoot"] + global["config"].uploads.path + path;
    if (fs.existsSync(fullpath)) {
      fs.unlinkSync(fullpath);
    }
  }

  public randomString = (length, noOnly = false): string => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (noOnly) {
      characters = "0123456789";
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  protected salt = (): string => {
    const numberPart = Math.floor(Math.random() * 9) + 1;
    const firstString =
      this.randomString(39 - numberPart) + this.randomString(numberPart, true);
    const number = Math.floor(Math.random() * 30) + 10;
    const secondString =
      this.randomString(numberPart, true) + this.randomString(39 - numberPart);
    return firstString + number + secondString;
  };

  private secretSalt = (salt: string): string => {
    const saltN = parseInt(salt.substr(39, 41));
    return config.secret.substr(saltN, 100);
  };

  public passwordEn = (
    password: string,
    salt?: string
  ): { password: string; salt: string } => {
    const RO = { password: "", salt: "" };
    if (!salt) {
      salt = this.salt();
    }
    RO.salt = salt;
    const enpass = saltedSha256(password, salt);
    RO.password = saltedSha256(enpass, this.secretSalt(salt));
    return RO;
  };
  public validateForm = (
    FormBody,
    Validationrules
  ): Promise<boolean | object> => {
    const validator = new Validator(FormBody, Validationrules);
    return new Promise((resolve, reject) => {
      function passes() {
        resolve(false);
      }
      function fails() {
        resolve(validator.errors.all());
      }
      validator.checkAsync(passes, fails);
    });
  };
  public getFormFields = (FormBody: Object, Validationrules: Object): any => {
    const res = {};
    Object.keys(Validationrules).forEach((key) => {
      res[key] = FormBody[key];
    });
    return res;
  };
}
