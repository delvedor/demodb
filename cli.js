#! /usr/bin/env node

'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const pump = require('pump')
const minimist = require('minimist')
const Fastify = require('fastify')
const PinoColada = require('pino-colada')
const commist = require('commist')()
const help = require('help-me')({
  // the default
  dir: path.join(path.dirname(require.main.filename), 'help')
})
commist.register('start', start)
commist.register('help', help.toStdout)
commist.register('version', function () {
  console.log('v' + require(path.join(__dirname, 'package.json')).version)
})

const res = commist.parse(process.argv.splice(2))

if (res) {
  // no command was recognized
  help.toStdout(res)
}

function showHelp () {
  console.log(fs.readFileSync(
    path.join(path.dirname(require.main.filename), 'help', 'start.txt'),
    'utf8'
  ))
  process.exit(0)
}

function start (args) {
  const opts = minimist(args, {
    integer: ['port', 'delay'],
    string: ['log-level'],
    boolean: ['save'],
    alias: {
      port: 'p',
      help: 'h',
      save: 's',
      delay: 'd',
      'log-level': 'l'
    }
  })

  if (opts.help) {
    return showHelp()
  }

  if (opts._.length !== 1) {
    console.error('Missing database name!\n')
    return showHelp()
  }

  const pinoColada = PinoColada()
  pump(pinoColada, process.stdout, assert.ifError)
  const options = {
    logger: {
      level: opts['log-level'] || 'info',
      stream: pinoColada
    }
  }

  const fastify = Fastify(options)
  fastify.register(require('./server'), opts)
  fastify.listen(opts.port || 8081, assert.ifError)

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  function shutdown () {
    fastify.close(() => {
      process.exit(0)
    })
  }
}
