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

describe('Remote info ', () => {
  it('lastUpdated changes when updating remote info', async () => {
    const res = await chai.request(app).post('/api').send({
      query: `query {
          server (id: 1) {
              lastUpdated
          }
      }`,
    })
    console.log(res.body.data)
    const oldTime = res.body.data.server.lastUpdated

    const res2 = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation {
              updateRemoteInfo(id: 1, ip: "eu.mineplex.com") {
                lastUpdated
              }
            }
            `,
      })

    console.log(res2.body.data)
    const newTime = res2.body.data.updateRemoteInfo.lastUpdated
    expect(res2).to.have.status(200)
    expect(newTime).to.be.a('string')
    expect(newTime).to.not.equal(oldTime)
  })
  it("mods can update info of servers they don't own", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.MOD_TOKEN)
      .send({
        query: `mutation {
              updateRemoteInfo(id: 2, ip: "eu.mineplex.com") {
                lastUpdated
              }
            }
            `,
      })

    expect(res).to.have.status(200)
  })
  it("users can't update info of servers they don't own", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation {
              updateRemoteInfo(id: 3, ip: "eu.mineplex.com") {
                lastUpdated
              }
            }
            `,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it('users can update info of servers they own', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation {
              updateRemoteInfo(id: 2, ip: "eu.mineplex.com") {
                lastUpdated
              }
            }
            `,
      })
    expect(res).to.have.status(200)
  })
  it("banned users can't update info of servers they own", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.BANNED_TOKEN)
      .send({
        query: `mutation {
              updateRemoteInfo(id: 1, ip: "eu.mineplex.com") {
                lastUpdated
              }
            }
            `,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
})
