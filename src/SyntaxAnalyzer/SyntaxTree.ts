import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Class } from "./Class";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";

export class SyntaxTree extends SyntacticElement {
    body: Class[] = [];

    read(builder: ElementBuilder) {
        while(builder.going) {
            yourtakingtoolong();

            this.body.push(builder.readElement(Class));
        }

        return builder.finish();
    }
}