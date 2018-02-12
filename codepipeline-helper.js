'use strict'
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION })
const codepipeline = new AWS.CodePipeline(process.env.REGION)
const PIPELINE_HISTORY = 'https://###REGION###.console.aws.amazon.com/codepipeline/home?region=###REGION####/view/###PIPELINE###/history'

module.exports.getPipelineExecutionDetails = (executionId, pipeline) => {
  const promises = []
  promises.push(getPipelineExecution(executionId, pipeline))
  promises.push(getPipelineState(pipeline))
  return Promise.all(promises).then(([execution, state]) => {
    return {
      execution: execution,
      state: state,
      executionHistoryUrl: PIPELINE_HISTORY
        .replace(new RegExp('###REGION###', 'g'), process.env.REGION)
        .replace(new RegExp('###PIPELINE###', 'g'), pipeline)
    }
  })
}

function getPipelineExecution (executionId, pipeline) {
  const params = {
    pipelineExecutionId: executionId,
    pipelineName: pipeline
  }
  return new Promise((resolve, reject) => {
    codepipeline.getPipelineExecution(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function getPipelineState (pipeline) {
  const params = {
    name: pipeline
  }
  return new Promise((resolve, reject) => {
    codepipeline.getPipelineState(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
