const CharacterModel = require("../models/character");

class CharacterService {
  static async getLevelCharacters(levelId) {
    const characters = await CharacterModel.getLevelCharacters(levelId);
    return characters;
  }
}

module.exports = CharacterService;
