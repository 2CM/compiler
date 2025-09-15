import { Expression } from "./Expression";
import { Zingle } from "./Zingle";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";
import { IHasScope } from "../SemanticAnalyzer/IHasScope";
import { IHasId } from "../SemanticAnalyzer/IHasId";
import { Member } from "./Member";

export class Field extends Member implements IHasId {
    defaultValue?: Zingle;
    
    id: string;

    static read(self: Field, builder: ElementBuilder) {
        if(builder.advancePastValue("=")) {
            self.defaultValue = builder.readElement(Expression);
        }

        builder.advancePastExpectedValue(";");

        return builder.finish();
    }

    createId(parentId: string) {
        this.id = `${this.type.toString()} ${parentId}.${this.name.value}`;
    }
}