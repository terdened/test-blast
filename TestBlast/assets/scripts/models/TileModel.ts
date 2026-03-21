import { Vec2 } from "cc";
import { TileColor } from "../common/enums/TileColor";

export class TileModel {
    position: Vec2;
    color: TileColor;

    public constructor(init?:Partial<TileModel>) {
        Object.assign(this, init);
    }
}