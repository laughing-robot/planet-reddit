import { Bin, FreeSpace, FreeSpaceDict } from "~packing/bin"
import { jsonify } from "~utils"

export class EdgeList {

    //variables
    ids : Array<number>;
    maxSize : number;
    freeSpaces : FreeSpaceDict;


    constructor(maxSize : number = 500) {
         this.ids = [...Array(maxSize).keys()];
         this.maxSize = maxSize;
         this.freeSpaces = {};
    };

    getString() : string {
        return jsonify({freeSpaces : this.freeSpaces}, 0);
    }

    pushList(spaces) : void {
        Object.keys(spaces).map((key, index) => {
            this.push(spaces[key]);
        }, this);
    }

    //TODO: add a 2D interval tree to check for adjacency (for linking)
    push(space) : void {

        if(space == null) {
            return;
        }

        if (this.size() > this.maxSize) {
            throw "Fatal error exceeded maxSize";
        }

        space.id = this.ids.pop();
        this.freeSpaces[space.id] = space;
        this.linkSpace(space);
    }

    remove(id) : void {
        let space : FreeSpace = this.freeSpaces[id];

        // remove from others adjacencies
        // could be faster
        for(const adjId of space.getNeighbors()) {
            this.freeSpaces[adjId].remove(id);
        }

        delete this.freeSpaces[id];
        this.ids.push(id);
    }

    size() : number {
        return Object.keys(this.freeSpaces).length;
    }

    get(num) : FreeSpace {
        return this.freeSpaces[num];
    }

    linkSpace(newSpace) : void {
        for(const [ id, space ] of Object.entries(this.freeSpaces)) {
            this.updateAdjacencyBySpace(space, newSpace);
        } 
    }

    updateAdjacencyById(id1 : number, id2 : number) : void {
        this.updateAdjacencyBySpace(this.freeSpaces[id1], this.freeSpaces[id2]);
    }

    updateAdjacencyBySpace(spaceA : FreeSpace, spaceB : FreeSpace) {
                
        if(spaceA.id == spaceB.id) {
            return;
        }

        if (spaceA.y0 < spaceB.ye || spaceB.y0 < spaceA.ye) {
            if(spaceA.x0 == spaceB.xe) {
                spaceA.l.add(spaceB.id);
                spaceB.r.add(spaceA.id);
            }
            else if(spaceA.xe == spaceB.x0) {
                spaceA.r.add(spaceB.id);
                spaceB.l.add(spaceA.id);
            }
        }
        else if(spaceA.x0 < spaceB.xe || spaceB.x0 < spaceA.xe) {
            if (spaceA.y0 == spaceB.ye) {
                spaceA.b.add(spaceB.id);
                spaceB.a.add(spaceA.id);
            }
            else if(spaceA.ye == spaceB.y0) {
                spaceA.a.add(spaceB.id);
                spaceB.b.add(spaceA.id);
            }
        }
    }
};
