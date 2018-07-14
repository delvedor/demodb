'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function (fastify, opts) {
  const dbName = opts._
  const delay = opts.delay || null
  fastify
    .register(require('fastify-sensible'))
    .register(AutoLoad, {
      dir: path.join(__dirname, 'plugins'),
      options: {
        autosave: !!opts.save, dbName, delay }
    })
    .register(AutoLoad, {
      dir: path.join(__dirname, 'services')
    })
}
