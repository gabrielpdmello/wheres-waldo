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

test("Return empty levels array", (done) => {
  request(app)
    .get("/levels/")
    .expect("Content-Type", /json/)
    .expect([])
    .expect(200, done);
});

test("Return levels array", async () => {
  await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  const res = await request(app)
    .get("/levels/")
    .expect("Content-Type", /json/)
    .expect(200);

  expect(res.body).toEqual([
    {
      id: expect.any(Number),
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  ]);
});

test("Return level by id", async () => {
  const level = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  const res = await request(app)
    .get(`/levels/${level.id}`)
    .expect("Content-Type", /json/)
    .expect(200);

  expect(res.body).toEqual({
    id: expect.any(Number),
    title: "When the Stars Come Out",
    imgUrl: "levels/1/img.webp",
    description: "Level description",
    marker_size: 3,
  });
});

test("Return 404 when level does not exists", (done) => {
  request(app)
    .get("/levels/1")
    .expect("Content-Type", /json/)
    .expect(404, done);
});

test("Return 400 when id is invalid", (done) => {
  request(app)
    .get("/levels/nan")
    .expect("Content-Type", /json/)
    .expect(400, done);
});

test("Return level leaderboard", async () => {
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
    .get(`/levels/${level1.id}/leaderboard`)
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
  ]);
});

test("Return 404 when requesting level leaderboard that doesn't exist", (done) => {
  request(app)
    .get("/levels/1/leaderboard")
    .expect("Content-Type", /json/)
    .expect(404, done);
});

test("Return 400 when requesting level leaderboard with invalid id", (done) => {
  request(app)
    .get("/levels/nan/leaderboard")
    .expect("Content-Type", /json/)
    .expect(400, done);
});

test("Return level characters", async () => {
  const level = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  await prisma.character.createMany({
    data: [
      { id: 1, name: "Waldo", imgUrl: "characters/waldo.jpg" },
      { id: 2, name: "Odlaw", imgUrl: "characters/odlaw.png" },
      { id: 3, name: "Wenda", imgUrl: "characters/wenda.png" },
      {
        id: 4,
        name: "Wizard Whitebeard",
        imgUrl: "characters/wizard_whitebeard.png",
      },
    ],
  });

  await prisma.level_character.createMany({
    data: [
      {
        level_id: level.id,
        imgUrl: "levels/1/characters/waldo.png",
        character_id: 1,
        pos: [0.702, 0.427],
      },
      {
        level_id: level.id,
        imgUrl: "levels/1/characters/odlaw.png",
        character_id: 2,
        pos: [0.557, 0.796],
      },
      {
        level_id: level.id,
        imgUrl: "levels/1/characters/wenda.png",
        character_id: 3,
        pos: [0.592, 0.67],
      },
      {
        level_id: level.id,
        imgUrl: "levels/1/characters/wizard_whitebeard.png",
        character_id: 4,
        pos: [0.69, 0.674],
      },
    ],
  });

  const res = await request(app)
    .get(`/levels/${level.id}/characters`)
    .expect("Content-Type", /json/)
    .expect(200);

  expect(res.body).toEqual([
    { id: 1, name: "Waldo", imgUrl: "characters/waldo.jpg" },
    { id: 2, name: "Odlaw", imgUrl: "characters/odlaw.png" },
    { id: 3, name: "Wenda", imgUrl: "characters/wenda.png" },
    {
      id: 4,
      name: "Wizard Whitebeard",
      imgUrl: "characters/wizard_whitebeard.png",
    },
  ]);
});

test("Return 404 for characters from a level that does not exist", (done) => {
  request(app)
    .get("/levels/1/characters")
    .expect("Content-Type", /json/)
    .expect(404, done);
});

test("Return 400 for characters with invalid level id", (done) => {
  request(app)
    .get("/levels/nan/characters")
    .expect("Content-Type", /json/)
    .expect(400, done);
});
