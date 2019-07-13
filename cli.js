#!/usr/bin/env node

const cli = require('@ianwalter/cli')
const { print } = require('@ianwalter/print')
const msee = require('msee')
const commits = require('.')

async function run () {
  const { _: [start, end] } = cli({ name: 'commits' })
  const { markdown } = await commits(start, end)
  process.stdout.write(msee.parse(markdown))
}

run().catch(err => print.error(err))
