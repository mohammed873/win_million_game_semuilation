var TeleSignSDK = require("telesignsdk");

exports.sendSms = (phone) => {
  const customerId = process.env.CUSTOMER_ID;
  const apiKey = process.env.API_KEY;
  const rest_endpoint = "https://rest-api.telesign.com";
  const timeout = 10 * 1000; // 10 secs

  const client = new TeleSignSDK(
    customerId,
    apiKey,
    rest_endpoint,
    timeout // optional
    // userAgent
  );

  const phoneNumber = "212" + phone;
  const accountLifeCycleEvent = "create";

  console.log("## ScoreClient.score ##");

  function score_callback(error, responseBody) {
    if (error === null) {
      console.log(
        `Score response for phone number: ${phoneNumber}` +
          ` => code: ${responseBody["status"]["code"]}` +
          `, description: ${responseBody["status"]["description"]}`
      );
    } else {
      console.error("Unable to get score. " + error);
    }
  }
  client.score.score(score_callback, phoneNumber, accountLifeCycleEvent);
};
