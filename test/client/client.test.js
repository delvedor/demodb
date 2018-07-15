'use strict'

const { test } = require('tap')
const { build } = require('./helper')
const Client = require('../../client')

test('Shoud be able to perform a find', async t => {
  const { end, port } = await build()

  const client = new Client({ url: `http://localhost:${port}` })
  const col = client.collection('test')

  await col.insert({
    winter: 'is coming',
    more: 'wine'
  })

  const result = await col.findOne({ more: 'wine' })

  t.is(typeof result._id, 'string')
  delete result._id
  t.deepEqual(result, {
    winter: 'is coming',
    more: 'wine'
  })

  await end()
})
