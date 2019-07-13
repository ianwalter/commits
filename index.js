const execa = require('execa')

module.exports = async (start = 30, end, excludeMerges = true) => {
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
  const { stdout } = await execa('git', args)

  //
  return stdout.split('\n').reduce(
    (acc, commit) => {
      //
      if (commit.trim()) {
        //
        let [hash, subject] = commit.split('SUBJECT:')
        if (hash.length === 7 && hash[6] !== ' ') {
          const markdown = `* \`${hash}\` ${subject}`
          acc.commits.push({ hash, subject, markdown })
          acc.markdown += markdown + '\n'
        } else {
          acc.commits[acc.commits.length - 1].body = hash
          acc.markdown += '> ' + hash + '\n'
        }
      }

      return acc
    },
    {
      commits: [],
      markdown: ''
    }
  )
}
