'use strict'

const fp = require('fastify-plugin')
const Loki = require('lokijs')
const path = require('path')
const LokiFSStructuredAdapter = require('lokijs/src/loki-fs-structured-adapter')

async function lokiPLugin (fastify, opts) {
  const { autosave, dbName } = opts
  const dbFile = path.join(__dirname, `${dbName || 'demodb'}.json`)
  const db = new Loki(dbFile, {
    verbose: autosave,
    autosave: autosave,
    autoload: autosave,
    autosaveInterval: autosave ? 1000 : undefined,
    adapter: autosave ? new LokiFSStructuredAdapter() : undefined,
    autosaveCallback: () => {
      fastify.log.info('Autosaved loki db')
    }
  })

  const loki = {
    db,
    collection: getOrAddCollection
  }

  fastify.decorate('loki', loki)
  fastify.addHook('onClose', (fastify, done) => {
    fastify.loki.db.close()
    done()
  })

  function getOrAddCollection (name) {
    const col = db.getCollection(name)
    if (col == null) {
      return db.addCollection(name, { unique: ['_id'] })
    }
    return col
  }
}

module.exports = fp(lokiPLugin)
