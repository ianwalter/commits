#!/usr/bin/env node

const cli = require('@ianwalter/cli')
const { print, md } = require('@ianwalter/print')
const commits = require('.')

async function run () {
  const { _: [start, end], merges } = cli({ name: 'commits' })
  const { description, markdown } = await commits(start, end, merges)

  print.info(md(description + ':'))
  print.write('\n')
  print.md(markdown)
  print.write('\n')
}

run().catch(err => print.error(err))
