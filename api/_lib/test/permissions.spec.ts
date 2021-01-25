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
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({ query: '{ users { username }}' })
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0].message).to.be.a('string', 'Not Authorised!')
  })
  it("users can't reset votes", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
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
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `mutation { updateRole(id: 65157, role: "user") { user { role } } }`,
      })
    expect(res).to.have.status(200)
    expect(res.body.data.updateRole.user).to.exist
    expect(res.body.data.updateRole.user.role).to.be.a('string', 'mod')
  })
  it("logged out users don't have editPrivileges", async () => {
    const res = await chai.request(app).post('/api').send({
      query: `query { server (id: 2) { title, hasEditPrivileges } }`,
    })
    expect(res.body.data.server.title).to.be.a('string', 'Test server 1')
    expect(res.body.data.server.hasEditPrivileges).to.be.a('boolean', 'false')
  })
  it('logged in users have editPrivileges for servers they own', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({
        query: `query { server (id: 2) { title, hasEditPrivileges } }`,
      })
    expect(res.body.data.server.title).to.be.a('string', 'Test server 1')
    expect(res.body.data.server.hasEditPrivileges).to.be.a('boolean', 'true')
  })
  it("logged in users don't have editPrivileges for servers they don't own", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({
        query: `query { server (id: 3) { title, hasEditPrivileges } }`,
      })
    expect(res.body.data.server.title).to.be.a('string', 'Test server 3')
    expect(res.body.data.server.hasEditPrivileges).to.be.a('boolean', 'false')
  })
  it("mods have editPrivileges for servers they don't own", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
      .send({
        query: `query { server (id: 3) { title, hasEditPrivileges } }`,
      })
    expect(res.body.data.server.title).to.be.a('string', 'Test server 3')
    expect(res.body.data.server.hasEditPrivileges).to.be.a('boolean', 'true')
  })
  it("admins have editPrivileges for servers they don't own", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `query { server (id: 3) { title, hasEditPrivileges } }`,
      })
    expect(res.body.data.server.title).to.be.a('string', 'Test server 3')
    expect(res.body.data.server.hasEditPrivileges).to.be.a('boolean', 'true')
  })
  it("logged out users can't see unpublished servers", async () => {
    const res = await chai.request(app).post('/api').send({
      query: `query { server (id: 4) { title } }`,
    })
    expect(res.body.data.server).to.be.null
  })
  it("logged in users can't see unpublished servers", async () => {
    const res = await chai.request(app).post('/api').send({
      query: `query { server (id: 4) { title } }`,
    })
    expect(res.body.data.server).to.be.null
  })
  it('mods can see unpublished servers', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
      .send({
        query: `query { server (id: 4) { title } }`,
      })
    expect(res.body.data.server.title).to.be.a('string', 'Unpublished server')
  })
  it('admins can see unpublished servers', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `query { server (id: 4) { title } }`,
      })
    expect(res.body.data.server.title).to.be.a('string', 'Unpublished server')
  })
  it("logged out users can't see unpublished servers in feed", async () => {
    const res = await chai.request(app).post('/api').send({
      query: `query { feed { title } }`,
    })
    expect(res.body.data.feed).to.not.include.deep.members([
      { title: 'Unpublished server' },
    ])
  })
  it("logged in  users can't see unpublished servers in feed", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({
        query: `query { feed { title } }`,
      })
    expect(res.body.data.feed).to.not.include.deep.members([
      { title: 'Unpublished server' },
    ])
  })
  it('mods can see unpublished servers in feed', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
      .send({
        query: `query { feed { title } }`,
      })
    expect(res.body.data.feed).to.include.deep.members([
      { title: 'Unpublished server' },
    ])
  })
  it('admins can see unpublished servers in feed', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `query { feed { title } }`,
      })
    expect(res.body.data.feed).to.include.deep.members([
      { title: 'Unpublished server' },
    ])
  })
  it("logged out users can't see unpublished servers in feed by tag", async () => {
    const res = await chai.request(app).post('/api').send({
      query: `query { feedByTag ( tag: "third" ) { title } }`,
    })
    expect(res.body.data.feedByTag).to.not.include.deep.members([
      { title: 'Unpublished server' },
    ])
  })
  it("logged in  users can't see unpublished servers in feed by tag", async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.USER_TOKEN)
      .send({
        query: `query { feedByTag ( tag: "third" ) { title } }`,
      })
    expect(res.body.data.feedByTag).to.not.include.deep.members([
      { title: 'Unpublished server' },
    ])
  })
  it('mods can see unpublished servers in feed by tag', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.MOD_TOKEN)
      .send({
        query: `query { feedByTag ( tag: "third" ) { title } }`,
      })
    expect(res.body.data.feedByTag).to.include.deep.members([
      { title: 'Unpublished server' },
    ])
  })
  it('admins can see unpublished servers in feed by tag', async () => {
    const res = await chai
      .request(app)
      .post('/api')
      .set('Cookie', 'accessToken=' + process.env.ADMIN_TOKEN)
      .send({
        query: `query { feedByTag ( tag: "third" ) { title } }`,
      })
    expect(res.body.data.feedByTag).to.include.deep.members([
      { title: 'Unpublished server' },
    ])
  })
})
