import { Token } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { Line } from "./Line";
import { SyntacticElement } from "./SyntacticElement";

export class Body extends SyntacticElement {
    body: Line[] = [];

    read(builder: ElementBuilder) {
        builder.advancePastValue("{");
        
        while(builder.going) {
            yourtakingtoolong();

            if(builder.checkValue("}", "case", "default")) {
                break;
            }

            this.body.push(builder.readElement(Line));
        }

        return builder.finish();
    }
}