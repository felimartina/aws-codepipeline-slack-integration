'use strict'
const CodePipelineHelper = require('./codepipeline-helper')
const Constants = require('./constants')

module.exports.createSlackMessage = (codepipelineEventDetails, slackChannel) => {
  return CodePipelineHelper.getPipelineExecutionDetails(
    codepipelineEventDetails['execution-id'],
    codepipelineEventDetails.pipeline).then(pipelineDetails => {
      // TODO: Get git info from github directly??? this might require authorization
      const gitCommitInfo = pipelineDetails.execution.pipelineExecution.artifactRevisions[0]

      // Create slack fields per each stage
      const executionStages =
        pipelineDetails.state.stageStates.filter(x => x.latestExecution.pipelineExecutionId === codepipelineEventDetails['execution-id'])
      const fields = executionStages.map(stage => {
        const actionState = stage.actionStates[0]
        switch (stage.stageName.toUpperCase()) {
          case Constants.STAGES.SOURCE:
            return {
              title: `Commit`,
              value: `<${gitCommitInfo.revisionUrl}|${gitCommitInfo.revisionId.substring(0, 10)}> - ${gitCommitInfo.revisionSummary}`,
              short: false
            }
          case Constants.STAGES.DEPLOY:
          case Constants.STAGES.BUILD:
            return {
              title: `${actionState.actionName}`,
              value: actionState.latestExecution.externalExecutionUrl
                ? `<${actionState.latestExecution.externalExecutionUrl}|${actionState.latestExecution.status}>` : actionState.latestExecution.status,
              short: true
            }
          default:
            console.log(`Unknown stage: ${stage.stageName}`)
        }
      })

      const slackMessage = {
        channel: slackChannel,
        text: `AWS Pipeline status updated: <${pipelineDetails.executionHistoryUrl}|${codepipelineEventDetails.pipeline}>`,
        attachments: [{
          footer: `<https://github.com/felimartina/aws-codepipeline-slack-integration|CodePipeline Slack Integration>`,
          ts: Date.now() / 1000,
          color: getColorByState(pipelineDetails.execution.pipelineExecution.status),
          fields: fields
        }]
      }
      return slackMessage
    })
}

// Possible states for Action Levels events in codepipeline
function getColorByState (state) {
  switch (state.toUpperCase()) {
    case Constants.ACTION_LEVEL_STATES.FAILED:
      return Constants.SLACK_COLORS.ERROR
    case Constants.ACTION_LEVEL_STATES.SUCCEEDED:
      return Constants.SLACK_COLORS.SUCCESS
    case Constants.ACTION_LEVEL_STATES.CANCELED:
      return Constants.SLACK_COLORS.WARNING
    case Constants.ACTION_LEVEL_STATES.STARTED:
    default:
      return Constants.SLACK_COLORS.INFO
  }
}
