const { prisma } = require("../src/lib/prisma");
const request = require("supertest");
const app = require("../src/app");
const isUuid = require("./functions/isUuid");
const jwt = require("jsonwebtoken");

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

test("Start game and return game uuid", async () => {
  const level = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  const res = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id })
    .expect("Content-Type", /json/)
    .expect(201);

  expect(isUuid(res.body.gameId)).toBe(true);
});

test("Return 400 when not specifying level id", (done) => {
  request(app)
    .post("/games")
    .type("form")
    .expect("Content-Type", /json/)
    .expect(400, done);
});

test("Return 400 when level id is invalid", (done) => {
  request(app)
    .post("/games")
    .type("form")
    .send({ levelId: "nan" })
    .expect("Content-Type", /json/)
    .expect(400, done);
});

test("Return 404 when level id does not exists", (done) => {
  request(app)
    .post("/games")
    .type("form")
    .send({ levelId: 1 })
    .expect("Content-Type", /json/)
    .expect(404, done);
});

test("Return found character", async () => {
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
    ],
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const characters = await prisma.character.findMany();
  const levelCharacters = await prisma.level_character.findMany();
  const gameId = resGame.body.gameId;

  const res = await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: characters[0].id,
      xPos: levelCharacters[0].pos[0],
      yPos: levelCharacters[0].pos[1],
    })
    .expect("Content-Type", /json/)
    .expect(200);

  expect(res.body.character.name).toBe(characters[0].name);
});

test("Return token after finding all characters", async () => {
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

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const characters = await prisma.character.findMany();
  const levelCharacters = await prisma.level_character.findMany();
  const gameId = await resGame.body.gameId;

  await request(app).post(`/games/${gameId}/find`).type("form").send({
    characterId: characters[0].id,
    xPos: levelCharacters[0].pos[0],
    yPos: levelCharacters[0].pos[1],
  });

  await request(app).post(`/games/${gameId}/find`).type("form").send({
    characterId: characters[1].id,
    xPos: levelCharacters[1].pos[0],
    yPos: levelCharacters[1].pos[1],
  });

  await request(app).post(`/games/${gameId}/find`).type("form").send({
    characterId: characters[2].id,
    xPos: levelCharacters[2].pos[0],
    yPos: levelCharacters[2].pos[1],
  });

  const res = await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: characters[3].id,
      xPos: levelCharacters[3].pos[0],
      yPos: levelCharacters[3].pos[1],
    });

  const token = res.body.token;
  const decoded = jwt.decode(token);

  expect(decoded.gameId).toBe(gameId);
});

test("Return found character after finding character within margin of error", async () => {
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
    ],
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const characters = await prisma.character.findMany();
  const levelCharacters = await prisma.level_character.findMany();
  const gameId = await resGame.body.gameId;

  const errorMargin = level.marker_size / 100 / 2;
  const xPosMargin =
    levelCharacters[0].pos[0] + levelCharacters[0].pos[0] * errorMargin;
  const yPosMargin =
    levelCharacters[0].pos[1] - levelCharacters[0].pos[1] * errorMargin;

  const res = await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: characters[0].id,
      xPos: xPosMargin,
      yPos: yPosMargin,
    })
    .expect("Content-Type", /json/)
    .expect(200);

  expect(res.body.character.name).toBe(characters[0].name);
});

test("Return 400 if xPos, yPos and characterIs is not specified", async () => {
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
    ],
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const gameId = resGame.body.gameId;

  await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .expect("Content-Type", /json/)
    .expect(400);
});

test("Return 400 if xPos, yPos and characterIs are not numbers", async () => {
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
    ],
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const gameId = resGame.body.gameId;

  await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({ xPos: "nan", yPos: "nan", characterId: "nan" })
    .expect("Content-Type", /json/)
    .expect(400);
});

test("Return 404 if gameId is not found", (done) => {
  request(app)
    .post(`/games/randomuuid/find`)
    .type("form")
    .send({
      characterId: 1,
      xPos: 0.5,
      yPos: 0.5,
    })
    .expect("Content-Type", /json/)
    .expect(404, done);
});

test("Return 409 if game is already won", async () => {
  const level = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  await prisma.character.createMany({
    data: [{ id: 1, name: "Waldo", imgUrl: "characters/waldo.jpg" }],
  });

  await prisma.level_character.createMany({
    data: [
      {
        level_id: level.id,
        imgUrl: "levels/1/characters/waldo.png",
        character_id: 1,
        pos: [0.702, 0.427],
      },
    ],
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const characters = await prisma.character.findMany();
  const levelCharacters = await prisma.level_character.findMany();
  const gameId = await resGame.body.gameId;

  const resFind1 = await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: characters[0].id,
      xPos: levelCharacters[0].pos[0],
      yPos: levelCharacters[0].pos[1],
    });

  expect(resFind1.body.gameWin).toBe(true);

  await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: characters[0].id,
      xPos: levelCharacters[0].pos[0],
      yPos: levelCharacters[0].pos[1],
    })
    .expect(409);
});

test("Return 404 for character not found", async () => {
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
    ],
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const characters = await prisma.character.findMany();
  const gameId = await resGame.body.gameId;

  await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: characters[0].id,
      xPos: 0.5,
      yPos: 0.5,
    })
    .expect("Content-Type", /json/)
    .expect(404);
});

test("Return 409 if character is already found", async () => {
  const level = await prisma.level.create({
    data: {
      title: "When the Stars Come Out",
      imgUrl: "levels/1/img.webp",
      description: "Level description",
      marker_size: 3,
    },
  });

  const waldo = {
    id: 1,
    name: "Waldo",
    imgUrl: "characters/waldo.jpg",
    pos: [0.702, 0.427],
    levelImgUrl: "levels/1/characters/waldo.png",
  };
  const odlaw = {
    id: 2,
    name: "Odlaw",
    imgUrl: "characters/odlaw.png",
    pos: [0.557, 0.796],
    levelImgUrl: "levels/1/characters/odlaw.png",
  };

  await prisma.character.createMany({
    data: [
      { id: waldo.id, name: waldo.name, imgUrl: waldo.imgUrl },
      { id: odlaw.id, name: odlaw.name, imgUrl: odlaw.imgUrl },
    ],
  });

  await prisma.level_character.createMany({
    data: [
      {
        level_id: level.id,
        imgUrl: waldo.levelImgUrl,
        character_id: waldo.id,
        pos: waldo.pos,
      },
      {
        level_id: level.id,
        imgUrl: odlaw.levelImgUrl,
        character_id: odlaw.id,
        pos: odlaw.pos,
      },
    ],
  });

  const resGame = await request(app)
    .post("/games")
    .type("form")
    .send({ levelId: level.id });

  const gameId = await resGame.body.gameId;

  await request(app).post(`/games/${gameId}/find`).type("form").send({
    characterId: waldo.id,
    xPos: waldo.pos[0],
    yPos: waldo.pos[1],
  });

  await request(app)
    .post(`/games/${gameId}/find`)
    .type("form")
    .send({
      characterId: waldo.id,
      xPos: waldo.pos[0],
      yPos: waldo.pos[1],
    })
    .expect(409);
});
