'use strict'

const fs = require('fs')
const exec = require('child_process').execSync
const modifyFiles = require('./utils').modifyFiles
const findDuplicates = require('./utils').findDuplicates

let minimistHasBeenInstalled = false

if (!fs.existsSync('./node_modules/minimist')) {
  exec('npm install minimist --silent')
  minimistHasBeenInstalled = true
}

const args = require('minimist')(process.argv.slice(2), {
  string: [
    'function-name',
    'region',
    'stage-name',
  ],
  default: {
    region: 'ap-southeast-1',
    'function-name': 'AwsServerlessExpressFunction',
    'stage-name': 'dev'
  }
})

if (minimistHasBeenInstalled) {
  exec('npm uninstall minimist --silent')
}

const functionName = args['function-name']
const region = args.region
const stageName = args['stage-name']

const duplicate = findDuplicates([functionName,region,stageName])
if (duplicate) {
  console.error('Duplicate key', duplicate)
  process.exit(1)
}

modifyFiles(['./package.json'], [{
  regexp: /YOUR_AWS_REGION/g,
  replacement: region
}, {
  regexp: /YOUR_SERVERLESS_EXPRESS_LAMBDA_FUNCTION_NAME/g,
  replacement: functionName
}, {
  regexp: /YOUR_STAGE/g,
  replacement: stageName
}])