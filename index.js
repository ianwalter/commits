const execa = require('execa')

module.exports = async (start = 30, end, excludeMerges = true) => {
  const data = { commits: [], markdown: '' }

  //
  let args = ['log', '--format=%hSUBJECT:%s\n%b']

  //
  try {
    start = parseInt(start, 10)
    end = parseInt(end, 10)
  } catch {}

  //
  if (typeof start === 'number') {
    args = args.concat(['-n', start])
    data.description = `Last ${start} commits`
  } else {
    args.push(`--grep='${start}'`)
  }

  //
  if (typeof end === 'boolean') {
    excludeMerges = end
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
