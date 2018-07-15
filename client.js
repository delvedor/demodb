'use strict'

/**
 * Usage:
 * const db = new DemoDbClient('http://localhost:8081')
 * db.collection('demo').find({ name: 'john' })
 */

const got = require('got')

function DemoDbClient (opts) {
  this.url = opts.url
}

DemoDbClient.prototype.collection = function (collection) {
  return new CollectionClient({
    url: this.url,
    collection
  })
}

function CollectionClient (opts) {
  this.url = opts.url
  this._collection = opts.collection
}

CollectionClient.prototype.find = async function (query) {
  const { body } = await got.post(
    `${this.url}/db/${this._collection}/find`,
    { body: query, json: true }
  )

  return body
}

CollectionClient.prototype.findOne = async function (query) {
  const { body } = await got.post(
    `${this.url}/db/${this._collection}/findOne`,
    { body: query, json: true }
  )

  return body
}

CollectionClient.prototype.insert = async function (query) {
  const { body } = await got.post(
    `${this.url}/db/${this._collection}/insert`,
    { body: query, json: true }
  )

  return body
}

CollectionClient.prototype.update = async function (query) {
  const { body } = await got.post(
    `${this.url}/db/${this._collection}/update`,
    { body: query, json: true }
  )

  return body
}

CollectionClient.prototype.remove = async function (query) {
  const { body } = await got.post(
    `${this.url}/db/${this._collection}/remove`,
    { body: query, json: true }
  )

  return body
}

module.exports = DemoDbClient
