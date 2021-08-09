"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const xml2js_1 = __importDefault(require("xml2js"));
const parser = new xml2js_1.default.Parser();
const BASE_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@';
const USER_NAME = 'elfi-y';
const MEDIUM_URL = BASE_URL + USER_NAME;
const getUserData = async () => {
    try {
        const response = await node_fetch_1.default(MEDIUM_URL, {
            method: 'GET',
        });
        const statusCode = await response.status;
        const result = await response.json();
        console.log('RESULT', statusCode);
        console.log('RESULT', result.items.length);
        parser.parseString(result, function (error, result) {
            if (error === null) {
                console.log(result);
            }
            else {
                console.log(error);
            }
        });
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
(async () => {
    await getUserData();
})();
//# sourceMappingURL=get.js.map