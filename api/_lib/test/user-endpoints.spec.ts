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

describe('User Endpoints', () => {
  it('fetches logged in user profile', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({ query: '{ me { username }}' })
    expect(res).to.have.status(200)
    expect(res.body.data.me.username).to.exist
  })
  it('fetches list of users', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({ query: '{ users { username }}' })
    expect(res).to.have.status(200)
    expect(res.body.data.users).to.be.an('array')
  })
})
