const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')

const { hashSource } = require('../index.js')

test('hashSource hashes a file', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'paqjs-'))
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }))

  const source = path.join(directory, 'source.txt')
  fs.writeFileSync(source, 'paqjs', 'utf8')

  assert.match(hashSource(source, true), /^[0-9a-f]{64}$/)
})

test('hashSource throws for a missing source', () => {
  const source = path.join(os.tmpdir(), `paqjs-missing-${process.pid}-${Date.now()}`)

  assert.throws(
    () => hashSource(source, true),
    (error) => error instanceof Error && /failed to traverse source/.test(error.message),
  )
})
