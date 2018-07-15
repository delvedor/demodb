'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('Shoud be able to perform a find', async t => {
  const { fastify, end } = await build()
  var response = await fastify.inject({
    method: 'POST',
    url: '/db/test-collection/insert',
    payload: { hello: 'world' }
  })

  t.strictEqual(response.statusCode, 201)
  const payload = JSON.parse(response.payload)
  t.is(typeof payload._id, 'string')

  response = await fastify.inject({
    method: 'POST',
    url: '/db/test-collection/find',
    payload: { _id: payload._id }
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), [{
    _id: payload._id,
    hello: 'world'
  }])

  await end()
})

test('Shoud be able to perform a findOne', async t => {
  const { fastify, end } = await build()
  var response = await fastify.inject({
    method: 'POST',
    url: '/db/test-collection/insert',
    payload: { hello: 'world' }
  })

  t.strictEqual(response.statusCode, 201)
  const payload = JSON.parse(response.payload)
  t.is(typeof payload._id, 'string')

  response = await fastify.inject({
    method: 'POST',
    url: '/db/test-collection/findOne',
    payload: { _id: payload._id }
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), {
    _id: payload._id,
    hello: 'world'
  })

  await end()
})
