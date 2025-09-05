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

    static read(self: Method, builder: ElementBuilder) {
        if(builder.matchElement(Generic)) {
            self.generic = builder.readElement(Generic);
        }

        builder.advancePastExpectedValue("(");
        
        while(builder.going) {
            yourtakingtoolong();
            
            if(builder.advancePastValue(")")) break;

            self.parameters.push(builder.readElement(Parameter));
            builder.advancePastValue(",");
        }

        self.body = builder.readElement(Body);

        builder.advancePastExpectedValue("}");

        return builder.finish();
    }
}