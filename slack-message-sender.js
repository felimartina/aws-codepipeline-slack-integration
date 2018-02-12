'use strict'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const rp = require('request-promise')

module.exports.postMessage = (message) => {
  const options = {
    method: 'POST',
    uri: SLACK_WEBHOOK_URL,
    body: message,
    json: true
  }

  return rp(options)
}
