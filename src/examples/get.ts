import fetch from 'node-fetch';
import xml2js from 'xml2js';
const parser = new xml2js.Parser();

const BASE_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@';
const USER_NAME = 'elfi-y';
const MEDIUM_URL = BASE_URL + USER_NAME;

const getUserData = async () => {
  try {
    const response = await fetch(MEDIUM_URL, {
      method: 'GET',
    });

    const statusCode = await response.status;
    const result = await response.json();

    console.log('RESULT', statusCode);
    console.log('RESULT', result.items.length);

    parser.parseString(result, function (error, result) {
      if (error === null) {
        console.log(result);
      } else {
        console.log(error);
      }
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};

(async () => {
  await getUserData();
})();
