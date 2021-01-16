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

describe('Permissions', () => {
  it("user can't change roles", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation { updateRole(id: 65157, role: "mod") { user { role } } }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it("user can't ban", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation{
          updateBan(id: 9999, banned: true) {
            user{
              banned,
                username
            }
          }
        }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it("user can't view list of users", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({ query: '{ users { username }}' })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it("users can't reset votes", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.USER_TOKEN)
      .send({
        query: `mutation { resetVotes(id: 1") { title }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it('admin can set users to mods', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation { updateRole(id: 65157, role: "mod") { user { role } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.updateRole.user).to.exist
    expect(res.body.data.updateRole.user.role).to.be.a('string', 'mod')
  })
  it("mods can't change roles", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.MOD_TOKEN)
      .send({
        query: `mutation { updateRole(id: 9999, role: "admin") { user { role } } }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it('mods can ban users', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.MOD_TOKEN)
      .send({
        query: `mutation{
          updateBan(id: 9999, banned: true) {
            user{
              banned
            }
          }
        }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.updateBan.user.banned).to.be.a('boolean', true)
  })
  it('mods can unban users', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.MOD_TOKEN)
      .send({
        query: `mutation{
          updateBan(id: 9999, banned: false) {
            user{
              banned
            }
          }
        }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.updateBan.user.banned).to.be.a('boolean', false)
  })
  it("mods can't ban mods", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.MOD_TOKEN)
      .send({
        query: `mutation{
          updateBan(id: 65157, banned: true) {
            user{
              banned
            }
          }
        }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it("mods can't ban admins", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.MOD_TOKEN)
      .send({
        query: `mutation{
          updateBan(id: 6667, banned: true) {
            user{
              banned
            }
          }
        }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it("mods can't reset votes", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.MOD_TOKEN)
      .send({
        query: `mutation { resetVotes(id: 1") { title }`,
      })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it("mods can edit servers they don't own", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.MOD_TOKEN)
      .send({
        query: `
          mutation{
            updateTitle(id: 1, title: "New title of a big ole server") {
              title
            }
          }
        `,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.updateTitle).to.exist
    expect(res.body.data.updateTitle.title).to.be.a(
      'string',
      'New title of a big ole server',
    )
  })
  it('admin can set mods to users', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'token=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation { updateRole(id: 65157, role: "user") { user { role } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.updateRole.user).to.exist
    expect(res.body.data.updateRole.user.role).to.be.a('string', 'mod')
  })
})
