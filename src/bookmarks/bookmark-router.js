const express = require('express')
const path = require('path')
const BookmarkService = require('./bookmark-service')

const bookmarkRouter = express.Router()
const jsonParser = express.json()

bookmarkRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarkService.getAllBookmarks(knexInstance)
        .then(bookmarks => {
          res.json(bookmarks)
        }).catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, url, rating, description } = req.body
        const newBookmark = { title, url, rating, description }
        for (const [key, value] of Object.entries(newBookmark))
        if (value == null)
            return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
            })
        
        BookmarkService.insertBookmark(req.app.get('db'), newBookmark)
            .then(bookmark => {
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
                .json(bookmark)
            }).catch(next)
    })

bookmarkRouter
    .route('/:bookmark_id')
    .all((req, res, next) => {
        BookmarkService.getById(req.app.get('db'), req.params.bookmark_id)
        .then(bookmark => {
            if (!bookmark) {
                return res.status(404).json({
                  error: { message: `Bookmark doesn't exist` }
                })
              }
              res.json(bookmark)
              next()
        }).catch(next)
    })
    .delete((req, res, next) => {
        BookmarkService.deleteBookmark(
          req.app.get('db'),
          req.params.bookmark_id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { title, url, rating, description } = req.body
        const bookmarkToUpdate = { title, url, rating, description }
        
        const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length
          if (numberOfValues === 0) {
            return res.status(400).json({
              error: {
                message: `Request body must contain either 'title', 'url', 'rating' or 'description'`
              }
            })
        }

        BookmarkService.updateBookmark(
            req.app.get('db'),
            req.params.bookmark_id,
            bookmarkToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
      })

module.exports = bookmarkRouter