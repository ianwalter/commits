#!/usr/bin/env node

const cli = require('@ianwalter/cli')
const { print } = require('@ianwalter/print')
const marked = require('marked')
const TerminalRenderer = require('marked-terminal')
const commits = require('.')

marked.setOptions({ renderer: new TerminalRenderer() })

async function run () {
  const { _: [start, end] } = cli({ name: 'commits' })
  const { description, markdown } = await commits(start, end)

  print.info(`${description}:\n`)

  process.stdout.write(marked(markdown).trim() + '\n')
}

run().catch(err => print.error(err))
