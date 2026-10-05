const { prisma } = require("../lib/prisma.js");

class LevelModel {
  static async getAllLevels() {
    const levels = await prisma.level.findMany();
    return levels;
  }

  static async getLevelById(id) {
    const level = await prisma.level.findUnique({
      where: {
        id: id,
      },
    });
    return level;
  }
}

module.exports = LevelModel;
