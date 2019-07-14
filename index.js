const execa = require('execa')

module.exports = async (start = 30, end = 'HEAD', excludeMerges = true) => {
  const data = { commits: [], markdown: '' }

  //
  let args = ['log', '--format=%hSUBJECT:%s\n%b']

  //
  const startNumber = parseInt(start, 10)
  start = isNaN(startNumber) ? start : startNumber

  //
  if (typeof start === 'number') {
    args = args.concat(['-n', start])
    data.description = `Last ${start} commits`
  } else {
    const format = '--format=%h'
    const { stdout } = await execa('git', ['log', `--grep=${start}`, format])

    if (!stdout) {
      throw new Error(`Start commit not found using: ${start}`)
    }

    let endHash
    if (end !== 'HEAD') {
      const { stdout } = await execa('git', ['log', `--grep=${end}`, format])
      endHash = stdout
    }

    data.description = `Commits from ${start} (${stdout}) to ${end}`

    if (endHash) {
      data.description += ` (${endHash})`
    }

    args.push(`${stdout}^..${end}`)
  }

  //
  if (excludeMerges) {
    args.push('--no-merges')
  }

  //
  const { stdout: remote } = await execa('git', ['config', 'remote.origin.url'])
  const [repo] = remote.split(':')[1].split('.git')
  const ghUrl = `https://github.com/${repo}`

  //
  const { stdout } = await execa('git', args)

  //
  let inBody = false
  return stdout.split('\n').reduce(
    (acc, commit) => {
      //
      if (commit.trim()) {
        //
        let [hash, subject] = commit.split('SUBJECT:')
        if (hash.length === 7 && hash[6] !== ' ') {
          const markdown = `* [${hash}](${ghUrl}/commit/${hash}) ${subject}`
          acc.commits.push({ hash, subject, markdown })
          acc.markdown += (inBody ? '\n' : '') + markdown + '\n'
          inBody = false
        } else {
          acc.commits[acc.commits.length - 1].body = hash
          acc.markdown += '\n>   ' + hash
          inBody = true
        }
      }

      return acc
    },
    data
  )
}
