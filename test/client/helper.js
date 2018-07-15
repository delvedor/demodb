'use strict'

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const server = require('../../server')

async function build () {
  const fastify = Fastify()
  fastify.register(fp(server), { save: false })

  await fastify.listen(0)
  return { fastify, end, port: fastify.server.address().port }

  async function end () {
    await fastify.close()
  }
}

module.exports = { build }
