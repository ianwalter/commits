const path = require('path')
const { test } = require('@ianwalter/bff')
const { generateRepo } = require('@ianwalter/faygit')
const commits = require('.')

test('A number of commits are listed', async ({ expect }) => {
  const dir = path.join(__dirname, 'tmp')
  const generated = await generateRepo({ dir, force: true })
  const data = await commits({ dir, start: generated.commits.length })
  data.commits.reverse().forEach((commit, index) => {
    expect(generated.commits[index].subject).toBe(commit.subject)
  })
})
