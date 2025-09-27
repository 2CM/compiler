import { IEmitsIl, IlEmitter } from "../IntermediateCodeGenerator/IlEmitter";
import { Generic } from "./Generic";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";

export class ExpressionList extends SyntacticElement implements IEmitsIl {
    list: Zingle[];

    constructor(list: Zingle[]) {
        super();

        this.list = list;
    }

    emitIl(emitter: IlEmitter) {
        for(let zingle of this.list) {
            if(zingle instanceof Generic) throw new Error("what? why is there a generic here");

            zingle.emitIl(emitter);
        }
    }
}