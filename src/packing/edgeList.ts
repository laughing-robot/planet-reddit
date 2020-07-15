import { Bin, FreeSpace, FreeSpaceDict } from "~packing/bin"

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

    pushList(spaces) : void {
        Object.keys(spaces).map(function(key, index) {
            this.push(spaces[key]);
        });
    }

    push(space) : void {
        if (this.size() > this.maxSize) {
            throw "Fatal error exceeded maxSize";
        }

        space.id = this.ids.pop();
        this.freeSpaces[space.id] = space;
    }

    remove(id) : void {
        delete this.freeSpaces[id];
        this.ids.push(id);
    }

    size() : number {
        return Object.keys(this.freeSpaces).length;
    }

    get() : FreeSpaceDict {
        return this.freeSpaces;
    }

    //checks all spaces in spacesB against each space in spacesA
    //updates the adjacency list accordingly
    //edge list uses ids (hashmap)
    updateAdjacency(spaceIds : Array<number>, spacesB : Array<FreeSpace>) : void {

        spaceIds.forEach(function (spaceId : number, i) {

            let spaceA : FreeSpace = this.freeSpaces[spaceId];

            spacesB.forEach(function (spaceB : FreeSpace, j) {

                //skip null spaces
                if (spaceB == null) {
                    return;
                }

                //above or below
                if ((spaceA.x0 <= spaceB.x0 && spaceA.x0 >= spaceB.x0 + spaceB.w) || (spaceB.x0 <= spaceA.x0 && spaceB.x0 >= spaceA.x0 + spaceA.w)) {
                    if(spaceA.y0 + spaceA.h == spaceB.y0) {
                        //spaceA is below spaceB
                        spaceB.b.push(spaceA.id);
                        spaceA.a.push(spaceB.id);

                    }
                    else if(spaceB.y0 + spaceB.h == spaceA.y0) {
                        //spaceB is below spaceA
                        spaceB.a.push(spaceA.id);
                        spaceA.b.push(spaceB.id);
                    }

                }
                else if ((spaceA.y0 <= spaceB.y0 && spaceA.y0 >= spaceB.y0 + spaceB.h) || (spaceB.y0 <= spaceA.y0 && spaceB.y0 >= spaceA.y0 + spaceA.h)) {
                    if(spaceA.x0 + spaceA.w == spaceB.x0) {
                        //spaceA is left of spaceB
                        spaceB.l.push(spaceA.id);
                        spaceA.r.push(spaceB.id);

                    }
                    else if(spaceB.x0 + spaceB.w == spaceA.x0) {
                        //spaceA is left of spaceB
                        spaceB.r.push(spaceA.id);
                        spaceA.l.push(spaceB.id);
                    }

                }

            });
        }, this); //pass context
    };

};

exports.EdgeList = EdgeList;
