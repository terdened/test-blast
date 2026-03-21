export class GameModel {
    width: number;
    height: number;

    public constructor(init?:Partial<GameModel>) {
        Object.assign(this, init);
    }
}