'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('Shoud be able to perform an insert', async t => {
  const { fastify, end } = await build()
  const response = await fastify.inject({
    method: 'POST',
    url: '/db/test-collection/insert',
    payload: { hello: 'world' }
  })

  t.strictEqual(response.statusCode, 201)
  const payload = JSON.parse(response.payload)
  t.is(typeof payload._id, 'string')

  const stored = fastify.loki
    .collection('test-collection')
    .findOne({ _id: payload._id })

  t.is(typeof stored.meta, 'object')
  delete stored.meta
  t.deepEqual(stored, {
    hello: 'world',
    _id: payload._id,
    $loki: 1
  })

  await end()
})

test('Shoud be able to perform an update', async t => {
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
    url: '/db/test-collection/update',
    payload: { hello: 'people', _id: payload._id }
  })

  t.strictEqual(response.statusCode, 200)

  const stored = fastify.loki
    .collection('test-collection')
    .findOne({ _id: payload._id })

  t.is(typeof stored.meta, 'object')
  delete stored.meta
  t.deepEqual(stored, {
    hello: 'people',
    _id: payload._id,
    $loki: 1
  })

  await end()
})

test('Shoud be able to perform a remove', async t => {
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
    url: '/db/test-collection/remove',
    payload: { _id: payload._id }
  })

  t.strictEqual(response.statusCode, 200)

  const stored = fastify.loki
    .collection('test-collection')
    .findOne({ _id: payload._id })

  t.strictEqual(stored, null)
  await end()
})

test('Should return a 400 when using a reserved key', async t => {
  const { fastify, end } = await build()
  var response = await fastify.inject({
    method: 'POST',
    url: '/db/test-collection/insert',
    payload: { _id: 'hello' }
  })

  t.strictEqual(response.statusCode, 400)
  t.deepEqual(JSON.parse(response.payload), {
    error: 'Bad Request',
    message: '\'_id\' is a reserved property',
    statusCode: 400
  })

  response = await fastify.inject({
    method: 'POST',
    url: '/db/test-collection/insert',
    payload: { meta: 'hello' }
  })

  t.strictEqual(response.statusCode, 400)
  t.deepEqual(JSON.parse(response.payload), {
    error: 'Bad Request',
    message: '\'meta\' is a reserved property',
    statusCode: 400
  })

  response = await fastify.inject({
    method: 'POST',
    url: '/db/test-collection/insert',
    payload: { $loki: 'hello' }
  })

  t.strictEqual(response.statusCode, 400)
  t.deepEqual(JSON.parse(response.payload), {
    error: 'Bad Request',
    message: '\'$loki\' is a reserved property',
    statusCode: 400
  })

  await end()
})
