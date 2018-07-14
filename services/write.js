'use strict'

const Hyperid = require('hyperid')

async function writeService (fastify, opts) {
  const { loki, assert } = fastify
  const hyperid = Hyperid()

  fastify.route({
    method: 'POST',
    url: '/insert',
    handler: onInsert
  })

  async function onInsert (req, reply) {
    req.log.debug('insert', req.body)

    const { body, params } = req
    assert(
      body._id === undefined, 400,
      '\'_id\' is a reserved property'
    )
    assert(
      body.meta === undefined, 400,
      '\'meta\' is a reserved property'
    )
    assert(
      body.$loki === undefined, 400,
      '\'$loki\' is a reserved property'
    )

    body._id = hyperid()
    loki
      .collection(params.collection)
      .insert(body)

    reply.code(201)
    return { _id: body._id }
  }

  fastify.route({
    method: 'POST',
    url: '/update',
    handler: onUpdate
  })

  async function onUpdate (req, reply) {
    req.log.debug('update', req.body)

    const col = loki.collection(req.params.collection)
    const doc = col.findOne({ _id: req.body._id })
    assert(doc, 404)
    col.update(Object.assign(doc, req.body))

    return { status: 'ok' }
  }

  fastify.route({
    method: 'POST',
    url: '/remove',
    handler: onRemove
  })

  async function onRemove (req, reply) {
    req.log.debug('remove', req.body)

    const col = loki.collection(req.params.collection)
    const doc = col.findOne({ _id: req.body._id })
    col.remove(doc)

    return { status: 'ok' }
  }
}

module.exports = writeService
module.exports.autoPrefix = '/db/:collection'
