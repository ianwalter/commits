#!/usr/bin/env node

const cli = require('@ianwalter/cli')
const { print } = require('@ianwalter/print')
const marked = require('marked')
const TerminalRenderer = require('marked-terminal')
const commits = require('.')

marked.setOptions({ renderer: new TerminalRenderer() })

async function run () {
  const { _: [start, end], merges } = cli({ name: 'commits' })
  const { description, markdown } = await commits(start, end, merges)

  print.info(marked(description).trimEnd() + ':\n')

  process.stdout.write(marked(markdown).trimEnd() + '\n')
}

run().catch(err => print.error(err))
