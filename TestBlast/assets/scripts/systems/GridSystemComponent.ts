import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, Vec2 } from 'cc';
import { GridModel } from '../models/GridModel';
import { TileViewComponent } from '../views/TileViewComponent';
import { TileModel } from '../models/TileModel';
import { TileColor } from '../common/enums/TileColor';
import { GridViewComponent } from '../views/GridViewComponent';
const { ccclass, property } = _decorator;

@ccclass('GridSystemComponent')
export class GridSystemComponent extends Component {
    @property({type: Node})
    background: Node;

    @property({type: Prefab})
    tilePrefab: Prefab;

    model: GridModel;

    start() {
        this.init(6, 9);
    }

    init(width: number, height: number) {
        this.model = new GridModel({
            width: width,
            height: height,
            tiles: []
        });

        this.createTiles();
        this.createBackground();
    }

    createTiles() {
        for (var y = 0; y < this.model.height; y++)
        {
            let row: TileModel[] = [];
            
            for (var x = 0; x < this.model.width; x++)
            {
                let tileModel = new TileModel({
                    position: new Vec2(x, y),
                    color: randomRangeInt(0, 4) as TileColor
                });
                this.createTile(tileModel);
                row.push(tileModel);
            }

            this.model.tiles.push(row);
        }
    }

    createTile(model: TileModel) {
        const tileNode = instantiate(this.tilePrefab);
        this.background.addChild(tileNode);
        
        let viewComponent = tileNode.getComponent(TileViewComponent);
        viewComponent.init(model);
    }

    createBackground() {
        let viewComponent = this.background.getComponent(GridViewComponent);
        viewComponent.init(this.model);
    }
}


