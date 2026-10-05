const LevelCharacterModel = require("../models/levelCharacter");

class LevelCharacterService {
  static async getLevelCharacters(levelId) {
    const characters = await LevelCharacterModel.getLevelCharacters(levelId);
    return characters;
  }

  static async getLevelCharacterById(levelId, characterId) {
    const character = await LevelCharacterModel.getLevelCharacterById(
      levelId,
      characterId,
    );
    return character;
  }
}

module.exports = LevelCharacterService;
