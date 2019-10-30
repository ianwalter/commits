#!/usr/bin/env node

const cli = require('@ianwalter/cli')
const { print, md } = require('@ianwalter/print')
const commits = require('.')
const { description } = require('./package.json')

async function run () {
  const { _: [start, end], merges: excludeMerges } = cli({
    name: 'commits',
    description,
    usage: 'commits <start> [end]'
  })
  const data = await commits({ start, end, excludeMerges })

  print.info(md(data.description + ':'))
  print.write('\n')
  print.md(data.markdown)
  print.write('\n')
}

run().catch(err => print.error(err))
