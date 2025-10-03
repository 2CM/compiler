import { IEmitsIl, IlEmitter } from "../IntermediateCodeGenerator/IlEmitter";
import { IHasType } from "../SemanticAnalyzer/IHasType";
import { Scope } from "../SemanticAnalyzer/Scope";
import { TypeReference } from "../SemanticAnalyzer/TypeReference";
import { Generic } from "./Generic";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";

export class ExpressionList extends SyntacticElement implements IEmitsIl, IHasType {
    list: Zingle[];

    typeReference?: TypeReference;

    constructor(list: Zingle[]) {
        super();

        this.list = list;
    }

    emitIl(emitter: IlEmitter) {
        // for(let zingle of this.list) {
        //     if(zingle instanceof Generic) throw new Error("what? why is there a generic here");

        //     zingle.emitIl(emitter);
        // }
    }

    determineTypeReference(scope: Scope): void {
        for(let zingle of this.list) {
            if(zingle instanceof Generic) continue;

            zingle.determineTypeReference(scope);
        }
    }
}