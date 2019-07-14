const execa = require('execa')
const strip = require('strip')

module.exports = async (start = 30, end = 'HEAD', excludeMerges = true) => {
  const data = { commits: [], markdown: '' }

  //
  let args = ['log', '--format=%hSUBJECT:%s\n%b']

  //
  const startNumber = parseInt(start, 10)
  start = isNaN(startNumber) ? start : startNumber

  //
  const { stdout: remote } = await execa('git', ['config', 'remote.origin.url'])
  const [repo] = remote.split(':')[1].split('.git')
  const ghUrl = `https://github.com/${repo}`

  //
  if (typeof start === 'number') {
    args = args.concat(['-n', start])
    data.description = `**Last ${start} commits**`
  } else {
    //
    const startArgs = ['log', '--format=%h', `--grep=${start}`]
    const { stdout: startHash } = await execa('git', startArgs)

    if (!startHash) {
      throw new Error(`Start commit not found using: ${start}`)
    }

    //
    const endIsNotHead = end !== 'HEAD'
    let endHash = end
    if (endIsNotHead) {
      const result = await execa('git', ['log', `--grep=${end}`, '--format=%h'])
      endHash = result.stdout
    }

    //
    const commitRange = `${startHash}^..${endHash}`
    const commitRangeUrl = `${ghUrl}/compare/${encodeURIComponent(commitRange)}`

    //
    data.description = `**Commits from [${start} <${startHash}> to ${end}`
    if (endIsNotHead) {
      data.description += ` <${endHash}>`
    }
    data.description += `](${commitRangeUrl})**`

    args.push(commitRange)
  }

  //
  if (excludeMerges) {
    args.push('--no-merges')
  }

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
          acc.markdown += '\n>   ' + strip(hash)
          inBody = true
        }
      }

      return acc
    },
    data
  )
}
