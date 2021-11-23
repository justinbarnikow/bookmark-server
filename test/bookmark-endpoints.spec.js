const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const BookmarkService = require('../bookmarks/bookmark-service')
const app = require('../src/app')
const { testArrayBookmarks } = require('./bookmark-fixtures')

describe('bookmark endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after(() => db.destroy())
    before(() => db('bookmarks').truncate())

    context('given there are bookmarks in table', () => {
        const testBookmarks = testArrayBookmarks()

        beforeEach(() => {
            return db.into('bookmarks').insert(testBookmarks)
        })

        it('GET /bookmarks responds with 200 and all bookmarks', () => {
            return BookmarkService.getAllBookmarks(db)
            .then(results => {
                expect(results).to.eql(testBookmarks)
            })
        })

    })
})