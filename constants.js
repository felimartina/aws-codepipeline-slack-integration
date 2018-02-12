'use strict'
// TODO: Accept colors as parameters in ENV
const relevantStages = process.env.RELEVANT_STAGES || 'BUILD,DEPLOY'

module.exports.ACTION_LEVEL_STATES = {
  STARTED: 'STARTED',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED'
}
module.exports.STAGES = {
  SOURCE: 'SOURCE',
  BUILD: 'BUILD',
  DEPLOY: 'DEPLOY'
}
module.exports.SLACK_COLORS = {
  INFO: '#4542f4',
  WARNING: 'warning',
  SUCCESS: 'good',
  ERROR: 'danger'
}

module.exports.RELEVANT_STAGES =
  relevantStages
    .split(',')
    .map(stage => module.exports.STAGES[stage.toUpperCase()])
    .filter(stage => stage != null)
