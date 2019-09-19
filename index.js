const execa = require('execa')
const strip = require('strip')

module.exports = async (start = 30, end = 'HEAD', excludeMerges = true) => {
  const data = { commits: [], markdown: '' }

  // Create the arguments that will be passed to git.
  let args = ['log', '--format=%hSUBJECT:%s\n%b']

  // Determine if start is a number so that a number of commits can be listed
  // instead of a range.
  start = isNaN(start) ? start : parseInt(start, 10)

  // Determine the GitHub repository URL,
  const { stdout: remote } = await execa('git', ['config', 'remote.origin.url'])
  const [repo] = remote.split(':')[1].split('.git')
  const ghUrl = `https://github.com/${repo}`

  if (typeof start === 'number') {
    // If a number of commits is specified, add the arguments to the git command
    // and generate the description of the commit list.
    args = args.concat(['-n', start])
    data.description = `**Last ${start} commits**`
  } else {
    // Search for the specified commit and get it's hash.
    const startArgs = ['log', '--format=%h', `--grep=^${start}$`]
    const { stdout: startHash } = await execa('git', startArgs)

    if (!startHash) {
      throw new Error(`Start commit not found using: ${start}`)
    }

    // If end is specified, search for the commit and get it's hash.
    const endIsNotHead = end !== 'HEAD'
    let endHash = end
    if (endIsNotHead) {
      const args = ['log', `--grep=^${end}$`, '--format=%h']
      const result = await execa('git', args)
      endHash = result.stdout
    }

    // Build the commit range string and URL.
    const commitRange = `${startHash}..${endHash}`
    const commitRangeUrl = `${ghUrl}/compare/${encodeURIComponent(commitRange)}`

    // Generate the description with a link to the commit range on GitHub.
    data.description = `**Commits from [${start} <${startHash}> to ${end}`
    if (endIsNotHead) {
      data.description += ` <${endHash}>`
    }
    data.description += `](${commitRangeUrl})**`

    args.push(commitRange)
  }

  // Exclude merge commits.
  if (excludeMerges) {
    args.push('--no-merges')
  }

  // Execute the git log command to get the commit list.
  const { stdout } = await execa('git', args)

  // Parse the commit list into an object containing the data and a markdown
  // formatted string.
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
