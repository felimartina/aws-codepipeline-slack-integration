'use strict'
// The Slack channel to send a message to stored in the slackChannel environment variable
const SLACK_CHANNEL = process.env.SLACK_CHANNEL

const Constants = require('./constants')
const SlackHelper = require('./slack-helper')
const SlackMessageSender = require('./slack-message-sender')

function processEvent (event, callback) {
  console.log(JSON.stringify(event, 2, null))
  const eventDetails = event.detail

  if (eventDetails.action &&
    !Constants.RELEVANT_STAGES.find(stage => eventDetails.action.toUpperCase())) {
    console.log(`Untracked Stage: ${eventDetails.action.toUpperCase()}`)
    return Promise.resolve()
  }
  return SlackHelper.createSlackMessage(eventDetails, SLACK_CHANNEL)
    .then(SlackMessageSender.postMessage)
}

exports.handle = (event, context, callback) => {
  processEvent(event).then(result => {
    callback(null, 'Slack Message successfully pushed')
  }).catch(err => callback(err))
}
