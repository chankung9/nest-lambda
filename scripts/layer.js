#!/usr/bin/env node
'use strict'

const fs = require('fs')
const exec = require('child_process').execSync

fs.rmdirSync('./layer', { recursive: true })
console.log('./layer is deleted!')

fs.mkdirSync('./layer/nodejs', { recursive: true })
console.log('/layer/nodejs created successfully!')

fs.copyFileSync('./package.json', './layer/nodejs/package.json')
console.log('copy file package.json')

exec('cd ./layer/nodejs && npm install --production', { stdio: [0, 1, 2] })