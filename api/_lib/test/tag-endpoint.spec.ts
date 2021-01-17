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

describe('Tag Endpoints', () => {
  // SERVER TAGS

  it('non logged in users can view server tags', async () => {
    const res = await chai.request(app).post('/api').send({
      query: `query{ server(id: 1) { title, tags { tagName } } }`,
    })
    expect(res).to.have.status(200)
    expect(res.body.data.server.tags[0].tagName).to.be.a('string', 'test')
  })

  it('logged in users can view server tags', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({
        query: `query{ server(id: 1) { title, tags { tagName } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.server.tags[0].tagName).to.be.a('string', 'test')
  })

  it('non logged in users can view server authors from feed', async () => {
    const res = await chai.request(app).post('/api').send({
      query: `query{ feed { title, tags { tagName } } }`,
    })
    expect(res).to.have.status(200)
    expect(res.body.data.feed[0].tags[0].tagName).to.be.a('string', 'test')
  })

  it('logged in users can view server authors from feed', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({
        query: `query{ feed { title, tags { tagName } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.feed[0].tags[0].tagName).to.be.a('string', 'Guru')
  })
  it('tag search query works', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({
        query: `query { searchTags (searchString: "") { id } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.searchTags).to.be.an('array')
  })

  it('tag search query works with search string', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({
        query: `query { searchTags (searchString: "test") { id } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.searchTags).to.be.an('array')
  })
})
