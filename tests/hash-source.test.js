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

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'paqjs-'))
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }))
  return directory
}

function makeSymlink(t, link, target, isDirectory = false) {
  try {
    fs.symlinkSync(target, link, isDirectory ? 'dir' : 'file')
    return true
  } catch (error) {
    if (!['EPERM', 'EACCES', 'ENOSYS', 'ENOTSUP'].includes(error.code)) throw error
    t.skip(`Symlinks unavailable: ${error.message}`)
    return false
  }
}

test('v2 distinguishes an empty file from a directory', (t) => {
  const source = path.join(temporaryDirectory(t), 'source')
  fs.writeFileSync(source, '')
  const fileHash = hashSource(source, false)
  fs.unlinkSync(source)
  fs.mkdirSync(source)
  assert.notEqual(fileHash, hashSource(source, false))
})

test('v2 separates the path from the content', (t) => {
  const directory = temporaryDirectory(t)
  fs.writeFileSync(path.join(directory, 'a'), 'bc')
  const firstHash = hashSource(directory, false)
  fs.unlinkSync(path.join(directory, 'a'))
  fs.writeFileSync(path.join(directory, 'ab'), 'c')
  assert.notEqual(firstHash, hashSource(directory, false))
})

for (const isDirectory of [false, true]) {
  for (const rootLink of [false, true]) {
    test(`followLinks controls target hashing (directory=${isDirectory}, root=${rootLink})`, (t) => {
      const directory = temporaryDirectory(t)
      const target = path.join(directory, 'target')
      if (isDirectory) fs.mkdirSync(target)
      const content = isDirectory ? path.join(target, 'content.txt') : target
      fs.writeFileSync(content, 'before')
      let source = path.join(directory, 'source')
      fs.mkdirSync(source)
      const link = path.join(source, 'link')
      if (!makeSymlink(t, link, target, isDirectory)) return
      if (rootLink) source = link

      const defaultHash = hashSource(source, false)
      assert.equal(defaultHash, hashSource(source, false, false))
      const followedHash = hashSource(source, false, true)
      if (rootLink) assert.equal(followedHash, hashSource(target, false))

      fs.writeFileSync(content, 'after')
      assert.equal(defaultHash, hashSource(source, false))
      assert.notEqual(followedHash, hashSource(source, false, true))
    })
  }
}

test('following a broken link throws an Error', (t) => {
  const directory = temporaryDirectory(t)
  const link = path.join(directory, 'link')
  if (!makeSymlink(t, link, path.join(directory, 'missing'))) return
  assert.match(hashSource(link, false), /^[0-9a-f]{64}$/)
  assert.throws(() => hashSource(link, false, true), /failed to traverse source/)
})

test('following a symlink cycle throws an Error', (t) => {
  const directory = temporaryDirectory(t)
  if (!makeSymlink(t, path.join(directory, 'loop'), directory, true)) return
  assert.match(hashSource(directory, false), /^[0-9a-f]{64}$/)
  assert.throws(() => hashSource(directory, false, true), /failed to traverse source/)
})
