export {}
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const gql = require('graphql-tag')

let app: any

const { expect } = chai
chai.use(chaiHttp)

before(async () => {
  app = await server.default
})

describe('Server Endpoints', () => {
  it("Server title can't be nulled", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateTitle(id: 1, title: null) { server { title } } }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Expected type String!, found null.',
    )
  })
  it("Server title can't be short", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateTitle(id: 1, title: "test") { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Title must be at least 10 characters long.',
    )
  })
  it("Server title can't be too long", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateTitle(id: 1, title: "${new Array(281 + 1).join(
          'a',
        )}") { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Title must be less than 280 characters long.',
    )
  })
  it("Adding tags can't be length 0", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ addTag(id: 1, tags: []) { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'You need to specify at least one tag to add.',
    )
  })
  it("Removing tags can't be null", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ addTag(id: 1, tags: null) { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'You need to specify one tag to remove.',
    )
  })
  it('Cover needs to be a url', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ addTag(id: 1, cover: "test") { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Cover needs to be an url.',
    )
  })
  it('Cover needs to be a url', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ addTag(id: 1, cover: "http://test") { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Cover needs to be an image.',
    )
  })
  it('Content needs to be at least 280 characters long', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateContent(id: 1, content: "test") { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Content must be at least 280 characters long.',
    )
  })
  it('Content needs to be less than 10000 characters long', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ updateContent(id: 1, content: "${new Array(
          10001 + 1,
        ).join('a')}") { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Content must be less than 10000 characters long.',
    )
  })
  it("Can't create server with short title", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ createServer(title: "test") { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Title must be at least 10 characters long.',
    )
  })
  it("Can't create server with long title", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ createServer(title: "${new Array(281 + 1).join(
          'a',
        )}") { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'Title must be less than 280 characters long.',
    )
  })
  it("Can't create server with no tags", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation{ createServer(title: "${new Array(20 + 1).join(
          'a',
        )}", tags: []) { server { title } } }`,
      })
    expect(res.body.errors[0].message).to.be.a(
      'string',
      'You need to specify at least one tag to add.',
    )
  })
})
