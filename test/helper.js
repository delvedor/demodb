'use strict'

const Fastify = require('Fastify')
const fp = require('fastify-plugin')

async function build () {
  const fastify = Fastify()
  fastify.register(fp(require('../app')), { save: false })
  await fastify.ready()
  return { fastify, end }

  async function end () {
    await fastify.close()
  }
}

module.exports = { build }
