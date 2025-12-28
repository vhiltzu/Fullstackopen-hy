const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('blog API tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertOne(helper.sampleUser)
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('fetching blogs with initial data', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('returned blogs should have id, not _id', async () => {
      const response = await api.get('/api/blogs').expect(200)

      // Check that none of the returned blogs have _id and all have id
      const hasInternalIds = response.body.some((e) => e._id)
      const hasExternalIds = response.body.every((e) => e.id)

      assert(!hasInternalIds)
      assert(hasExternalIds)
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Test Author',
        url: 'http://example.com',
        likes: 8,
      }

      // Add the new blog
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getSampleToken()}`) // Authentication is required
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs').expect(200)
      const contents = response.body.map((r) => r.title)

      // Verify that the blog count has increased by one
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      // Verify that the new blog is among the returned blogs
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('if likes property is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'No Likes Author',
        url: 'http://example.com/nolikes',
      }

      // Add the new blog
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getSampleToken()}`) // Authentication is required
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Verify that the likes property defaults to 0
      assert.strictEqual(response.body.likes, 0)
    })

    test('blog without title and url is not added', async () => {
      const newBlog = {
        author: 'Missing Fields Author',
        likes: 4,
      }

      // Attempt to add the invalid blog
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getSampleToken()}`) // Authentication is required
        .send(newBlog)
        .expect(400)

      const response = await api.get('/api/blogs').expect(200)

      // Verify that the blog count has not changed
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      // Get the current blogs
      const blogsAtStart = await helper.blogsInDb()

      // Select a random blog to delete
      const randomIndex = Math.floor(Math.random() * blogsAtStart.length)

      // Delete the selected blog
      const blogToDelete = blogsAtStart[randomIndex]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${await helper.getSampleToken()}`)
        .expect(204)

      // Verify that the blog has been deleted
      const blogsAtEnd = await helper.blogsInDb()

      const title = blogsAtEnd.map((n) => n.title)
      assert(!title.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 if data is valid', async () => {
      // Get the current blogs
      const blogsAtStart = await helper.blogsInDb()

      // Update random blog with new likes
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes += 10

      const updatedData = {
        ...blogToUpdate,
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // Verify that the blog has been updated
      assert.strictEqual(response.body.likes, blogToUpdate.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})