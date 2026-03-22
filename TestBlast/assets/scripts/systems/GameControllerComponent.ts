import { _decorator, Component } from 'cc';
import { GameModel } from '../models/GameModel';
import { GameState } from '../common/enums/GameState';
const { ccclass, property } = _decorator;

@ccclass('GameControllerComponent')
export class GameControllerComponent extends Component {
    game: GameModel;

    start() {
        this.startGame();
    }

    startGame () {
        this.game.score = 0;
        this.game.state = GameState.GS_Play;
    }
}