import { _decorator, Component } from 'cc';
import { GameModel } from '../models/GameModel';
import { GameState } from '../common/enums/GameState';
import { TileModel } from '../models/TileModel';
import { GridControllerComponent } from './GridControllerComponent';
const { ccclass, property } = _decorator;

@ccclass('GameControllerComponent')
export class GameControllerComponent extends Component {
    @property({type: GridControllerComponent})
    gridController: GridControllerComponent;

    game: GameModel = new GameModel();
    _viewMap: Map<TileModel, Node> = new Map<TileModel, Node>();

    start() {
        this.startGame();
    }

    startGame () {
        this.game.score = 0;
        this.game.state = GameState.GS_Play;
        this.gridController.createGrid();
    }

    gameOver () {
        this.game.state = GameState.GS_GameOver;
    }

    newGame() {
        if (this.game !== undefined) {
            this.destroyGame();
        }

        this.start();
    }

    destroyGame() {
        this.gridController.clearGrid();
    }
}