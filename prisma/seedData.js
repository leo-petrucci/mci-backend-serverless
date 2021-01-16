const serverData = [
  {
    id: 1,
    title: 'Test server 2',
    content:
      'A description of the server that contains at least 200 characters, I do realise that is quite a lot but we might as well ask for a decent description rather than leaving it being shit. This is still not enough which is honestly quite surprising as I really did think it was going to be 200 characters',
    published: true,
    createdAt: '2020-11-22T15:47:25.476Z',
    cover: 'https://via.placeholder.com/350x150.jpg',
    slots: 1068,
    ip: 'eu.mineplex.com',
    authorId: 6667,
    versionId: 1,
    tags: { tagName: 'test 2' },
    version: { versionName: '1.8.x-1.16.x' },
  },
  {
    id: 2,
    title: 'Test server 1',
    content:
      'A description of the server that contains at least 200 characters, I do realise that is quite a lot but we might as well ask for a decent description rather than leaving it being shit. This is still not enough which is honestly quite surprising as I really did think it was going to be 200 characters',
    published: true,
    createdAt: '2020-11-22T15:47:25.476Z',
    cover: 'https://via.placeholder.com/350x150.jpg',
    slots: 1068,
    ip: 'eu.mineplex.com',
    authorId: 65157,
    versionId: 1,
    tags: { tagName: 'test 2' },
    version: { versionName: '1.8.x-1.16.x' },
  },
  {
    id: 3,
    title: 'Test server 3',
    content:
      'A description of the server that contains at least 200 characters, I do realise that is quite a lot but we might as well ask for a decent description rather than leaving it being shit. This is still not enough which is honestly quite surprising as I really did think it was going to be 200 characters',
    published: true,
    createdAt: '2020-11-22T15:47:25.476Z',
    cover: 'https://via.placeholder.com/350x150.jpg',
    slots: 1068,
    ip: 'eu.mineplex.com',
    authorId: 1,
    versionId: 1,
    tags: { tagName: 'third' },
    version: { versionName: '1.8.x-1.16.x' },
  },
]

const userData = [
  {
    id: 1,
    email: 'test@creativiii.com',
    username: 'Bannedaccount',
    role: 'user',
    photoUrl:
      'https://www.minecraftitalia.net/uploads/monthly_2020_04/Gator-in-Glasses.jpg.732642487878aada8a4c9aac0b5654f6.jpg',
    posts: 0,
    banned: true,
  },
  {
    id: 2,
    email: 'another@creativiii.com',
    username: 'Modaccount',
    role: 'mod',
    photoUrl:
      'https://www.minecraftitalia.net/uploads/monthly_2020_04/Gator-in-Glasses.jpg.732642487878aada8a4c9aac0b5654f6.jpg',
    posts: 0,
    banned: false,
  },
  {
    id: 6667,
    email: 'leonardo@creativiii.com',
    username: 'Guru',
    role: 'admin',
    photoUrl:
      'https://www.minecraftitalia.net/uploads/monthly_2020_04/Gator-in-Glasses.jpg.732642487878aada8a4c9aac0b5654f6.jpg',
    posts: 2556,
    banned: false,
  },
  {
    id: 9999,
    email: 'test@email.com',
    username: 'testuser',
    role: 'user',
    photoUrl:
      'https://www.minecraftitalia.net/uploads/monthly_2020_04/Gator-in-Glasses.jpg.732642487878aada8a4c9aac0b5654f6.jpg',
    posts: 2556,
    banned: false,
  },
  {
    id: 65157,
    email: 'leotest974@gmail.com',
    username: 'creativiii',
    role: 'user',
    photoUrl:
      'https://www.minecraftitalia.net/uploads/monthly_2020_04/Gator-in-Glasses.jpg.732642487878aada8a4c9aac0b5654f6.jpg',
    posts: 2556,
    banned: false,
  },
]

const tagData = [
  {
    tagName: 'test',
  },
  {
    tagName: 'test 2',
  },
  {
    tagName: 'third',
  },
]

const versionData = [
  {
    versionName: '1.8.x-1.16.x',
  },
]

const voteData = [
  {
    createdAt: '2020-12-21T15:47:25.476Z',
    authorId: 6667,
    serverId: 3,
  },
  {
    createdAt: '2020-12-18T15:47:25.476Z',
    authorId: 9999,
    serverId: 3,
  },
]

module.exports = {
  serverData,
  versionData,
  userData,
  tagData,
  voteData,
}
