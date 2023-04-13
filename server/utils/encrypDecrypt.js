import appConfig from "../common/appConfig";
import crypto from "crypto-js";

export const encrypt = (id) => {
    id = id.toString()
    const encryptedId = crypto.AES.encrypt(id, appConfig.sercetKey).toString();
    return encryptedId;
};

export const decrypt = (encryptedId) => {
    let encryptId = encryptedId.replace(/\s/g, "");
    let bytes = crypto.AES.decrypt(encryptId, appConfig.sercetKey);
    let decrpyted = bytes.toString(crypto.enc.Utf8);

    return decrpyted;
};