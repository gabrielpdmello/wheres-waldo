const { prisma } = require("../src/lib/prisma");
const request = require("supertest");
const app = require("../src/app");

beforeEach(async () => {
  await prisma.$transaction([
    prisma.leaderboard.deleteMany(),
    prisma.level_character.deleteMany(),
    prisma.level.deleteMany(),
    prisma.character.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("Return empty array when there's no scores", (done) => {
  request(app)
    .get("/leaderboards")
    .expect("Content-Type", /json/)
    .expect([])
    .expect(200, done);
});

test("Return array with scores of all levels", async () => {
  const level1 = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  const level2 = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  await prisma.leaderboard.createMany({
    data: [
      { name: "Player1", level_id: level1.id, time: 1001 },
      { name: "Player1", level_id: level1.id, time: 1002 },
      { name: "Player1", level_id: level1.id, time: 1003 },
      { name: "Player2", level_id: level2.id, time: 1001 },
      { name: "Player2", level_id: level2.id, time: 1002 },
      { name: "Player2", level_id: level2.id, time: 1003 },
    ],
  });

  const res = await request(app)
    .get("/leaderboards")
    .expect("Content-Type", /json/)
    .expect(200);

  expect(res.body).toEqual([
    {
      id: expect.any(Number),
      name: "Player1",
      level_id: level1.id,
      time: 1001,
    },
    {
      id: expect.any(Number),
      name: "Player1",
      level_id: level1.id,
      time: 1002,
    },
    {
      id: expect.any(Number),
      name: "Player1",
      level_id: level1.id,
      time: 1003,
    },
    {
      id: expect.any(Number),
      name: "Player2",
      level_id: level2.id,
      time: 1001,
    },
    {
      id: expect.any(Number),
      name: "Player2",
      level_id: level2.id,
      time: 1002,
    },
    {
      id: expect.any(Number),
      name: "Player2",
      level_id: level2.id,
      time: 1003,
    },
  ]);
});

test("Return 401 when trying to add score without token", (done) => {
  request(app).post("/leaderboards").send({ name: "name" }).expect(401, done);
});

test("Add new score after winning game", async () => {
  const level = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  await prisma.character.create({
    data: { id: 1, name: "Waldo", imgUrl: "characters/waldo.jpg" },
  });

  const character = await prisma.level_character.create({
    data: {
      level_id: level.id,
      imgUrl: "levels/1/characters/waldo.png",
      character_id: 1,
      pos: [0.702, 0.427],
    },
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const gameId = await resGame.body.gameId;

  const resFind = await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: character.character_id,
      xPos: character.pos[0],
      yPos: character.pos[1],
    })

  const token = `Bearer ${resFind.body.token}`;

  await request(app)
    .post("/leaderboards")
    .type("form")
    .set({
      Authorization: token,
    })
    .send({ name: "name" })
    .expect(201);
});

test("Return 400 when trying to add score without name field", async () => {
  const level = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  await prisma.character.create({
    data: { id: 1, name: "Waldo", imgUrl: "characters/waldo.jpg" },
  });

  const character = await prisma.level_character.create({
    data: {
      level_id: level.id,
      imgUrl: "levels/1/characters/waldo.png",
      character_id: 1,
      pos: [0.702, 0.427],
    },
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const gameId = await resGame.body.gameId;

  const resFind = await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: character.character_id,
      xPos: character.pos[0],
      yPos: character.pos[1],
    })

  const token = `Bearer ${resFind.body.token}`;

  await request(app)
    .post("/leaderboards")
    .type("form")
    .set({
      Authorization: token,
    })
    .expect(400);
});