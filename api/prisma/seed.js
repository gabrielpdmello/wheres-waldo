import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.level.createMany({
    data: [
      {
        title: "When the Stars Come Out",
        imgUrl: "levels/1/img.webp",
        description:
          "Wow, Waldo-watchers, this is what i call glamour! I'm at a major movie premiere. The stars have come to see the film: the crowds have come to see the stars. Look at that pink stretch limo - now that's a perfect car for a star. And who's in the bone-mobile behind? And doesn't king kong look nicer in life than when he's on the screen?",
        marker_size: 3,
      },
      {
        title: "Sports Stadium",
        imgUrl: "levels/2/img.webp",
        description:
          "On your marks, Waldo-champions! What a sports day! What a riot! Look at that umpire pinned down by javelins! Look at that pole vaulter. Breaking his pole! Look at that very tall high jumper!",
        marker_size: 4,
      },
      {
        title: "The Mighty Fruit Fight",
        imgUrl: "levels/3/img.webp",
        description:
          "Wow! Amazing! Have you ever in your lives seen a place so full of fruit! How sweet it is to sail lemon boats down orange juice rivers! But watch out, Waldo fans! The apples have turned sour and they're attacking all the other fruit, whoosh! squirt! splooooosh! There's a fruit jam in the river, scupples on the banana bridges, and sugar being poured all over the strawberries! Phew! What a mighty fruit fight!",
        marker_size: 2,
      },
    ],
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
        level_id: 1,
        imgUrl: "levels/1/characters/waldo.png",
        character_id: 1,
        pos: [0.702, 0.427],
      },
      {
        level_id: 1,
        imgUrl: "levels/1/characters/odlaw.png",
        character_id: 2,
        pos: [0.557, 0.796],
      },
      {
        level_id: 1,
        imgUrl: "levels/1/characters/wenda.png",
        character_id: 3,
        pos: [0.592, 0.67],
      },
      {
        level_id: 1,
        imgUrl: "levels/1/characters/wizard_whitebeard.png",
        character_id: 4,
        pos: [0.69, 0.674],
      },
      {
        level_id: 2,
        imgUrl: "levels/2/characters/waldo.png",
        character_id: 1,
        pos: [0.281, 0.349],
      },
      {
        level_id: 2,
        imgUrl: "levels/2/characters/odlaw.png",
        character_id: 2,
        pos: [0.599, 0.657],
      },
      {
        level_id: 2,
        imgUrl: "levels/2/characters/wenda.png",
        character_id: 3,
        pos: [0.250, 0.731],
      },
      {
        level_id: 2,
        imgUrl: "levels/2/characters/wizard_whitebeard.png",
        character_id: 4,
        pos: [0.613, 0.879],
      },
            {
        level_id: 3,
        imgUrl: "levels/3/characters/waldo.png",
        character_id: 1,
        pos: [0.891, 0.664],
      },
      {
        level_id: 3,
        imgUrl: "levels/3/characters/odlaw.png",
        character_id: 2,
        pos: [0.660, 0.563],
      },
      {
        level_id: 3,
        imgUrl: "levels/3/characters/wenda.png",
        character_id: 3,
        pos: [0.133, 0.847],
      },
      {
        level_id: 3,
        imgUrl: "levels/3/characters/wizard_whitebeard.png",
        character_id: 4,
        pos: [0.251, 0.492],
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
