module.exports = async (start, end, excludeMerges = true) => {
  //
  const args = ['--format="%h %s"']

  //
  if (typeof start === 'integer') {
    args = args.concat(['-n', start])
  }

  //
  if (typeof end === 'boolean') {
    excludeMerges = end
  }

  //
  if (excludeMerges) {
    options.push('--no-merged')
  }

  //
  const { stdout } = await execa('git', args)

  //
  return stdout.split('\n').map(commit => {
    const [sha, ...words] = commit.split(' ')
    return { sha, subject: words.join(' ') }
  })
}
