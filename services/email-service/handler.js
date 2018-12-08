'use strict';

module.exports.sendEmail = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Nothing was sent because this isn\'t ready yet :)',
      input: event,
    }),
  };
};
