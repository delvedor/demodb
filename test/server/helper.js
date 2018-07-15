'use strict'

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const server = require('../../server')

async function build () {
  const fastify = Fastify()
  fastify.register(fp(server), { save: false })

  await fastify.ready()
  return { fastify, end }

  async function end () {
    await fastify.close()
  }
}

module.exports = { build }
