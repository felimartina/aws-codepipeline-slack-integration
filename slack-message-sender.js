'use strict'
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const rp = require('request-promise-native')

module.exports.postMessage = (message) => {
  const options = {
    method: 'POST',
    uri: SLACK_WEBHOOK_URL,
    body: message,
    json: true
  }

  return rp(options)
}
