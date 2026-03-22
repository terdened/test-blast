import { GameState } from "../common/enums/GameState";

export class GameModel {
    score: number;
    state: GameState;

    public constructor(init?:Partial<GameModel>) {
        Object.assign(this, init);
    }
}