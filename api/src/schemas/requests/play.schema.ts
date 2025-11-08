export const playRequestSchema = {
  type: "object",
  required: ["playerId", "gameId", "betAmount", "winAmount"],
  properties: {
    playerId: { type: "string", minLength: 1 },
    gameId: { type: "string", minLength: 1 },
    betAmount: { type: "number", minimum: 1 },
    winAmount: { type: "number", minimum: 0 }
  },
  additionalProperties: false
};
