import { Expression } from "./Expression";
import { Zingle } from "./Zingle";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";

export class Field extends SyntacticElement {
    defaultValue?: Zingle;

    static read(self: Field, builder: ElementBuilder) {
        console.log("gijijefij")

        if(builder.advancePastValue("=")) {
            self.defaultValue = builder.readElement(Expression);
        }

        builder.advancePastExpectedValue(";");

        return builder.finish();
    }
}