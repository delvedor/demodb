'use strict'

const fp = require('fastify-plugin')
const sleep = require('then-sleep')

async function delayPlugin (fastify, opts) {
  const { delay } = opts

  fastify.addHook('onSend', async (req, reply, payload) => {
    if (delay) await sleep(delay)
  })
}

module.exports = fp(delayPlugin)
