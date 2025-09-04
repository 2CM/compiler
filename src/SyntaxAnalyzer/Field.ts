import { Expression } from "./Expression";
import { Zingle } from "./Zingle";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";

export class Field extends SyntacticElement {
    defaultValue?: Zingle;

    read(builder: ElementBuilder) {
        console.log("gijijefij")

        if(builder.advancePastValue("=")) {
            this.defaultValue = builder.readElement(Expression);
        }

        builder.advancePastExpectedValue(";");

        builder.finish();
    }
}