import { yourtakingtoolong } from "../Utils/Utils";
import { Body } from "./Body";
import { Parameter } from "./Parameter";
import { Generic } from "./Generic";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";

export class Method extends SyntacticElement {
    generic: Generic;
    parameters: Parameter[] = [];
    body: Body;

    read(builder: ElementBuilder) {
        if(builder.matchElement(Generic)) {
            this.generic = builder.readElement(Generic);
        }

        builder.advancePastExpectedValue("(");
        
        while(builder.going) {
            yourtakingtoolong();
            
            if(builder.advancePastValue(")")) break;

            this.parameters.push(builder.readElement(Parameter));
            builder.advancePastValue(",");
        }

        this.body = builder.readElement(Body);

        builder.advancePastExpectedValue("}");

        builder.finish();
    }
}