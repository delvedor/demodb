'use strict'

async function readService (fastify, opts) {
  const { loki, assert } = fastify

  fastify.route({
    method: 'POST',
    url: '/find',
    handler: onFind
  })

  async function onFind (req, reply) {
    req.log.debug('find', req.body)

    const result = loki
      .collection(req.params.collection)
      .find(req.body)

    assert(result.length, 404)

    result.forEach(data => {
      data.$loki = undefined
      data.meta = undefined
    })

    return result
  }

  fastify.route({
    method: 'POST',
    url: '/findOne',
    handler: onFindOne
  })

  async function onFindOne (req, reply) {
    req.log.debug('findOne', req.body)

    const data = loki
      .collection(req.params.collection)
      .findOne(req.body)

    assert(data, 404)

    data.$loki = undefined
    data.meta = undefined

    return data
  }
}

module.exports = readService
module.exports.autoPrefix = '/db/:collection'
