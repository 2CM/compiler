import { IEmitsIl, IlEmitter } from "../../IntermediateCodeGenerator/IlEmitter";
import { ElementMatcher } from "../ElementMatcher";
import { SyntacticElement } from "../SyntacticElement";

export class LineContent extends SyntacticElement implements IEmitsIl {
    static keyword?: string;
    
    static match(matcher: ElementMatcher) {
        matcher.matchValue(this.keyword ?? "");

        return matcher.finish();
    }

    emitIl(emitter: IlEmitter) {}
};