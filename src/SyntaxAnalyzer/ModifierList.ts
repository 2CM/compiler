import { Token, TokenType } from "../Tokenizer/Token";
import { yourtakingtoolong } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";
import { Keyword } from "./TokenContainers/Keyword";

export class ModifierList extends SyntacticElement {
    body: Keyword[] = []

    static match(tokens: Token[], startIndex: number) {
        return Keyword.modifierKeywords.has(tokens[startIndex].value);
    }

    read(builder: ElementBuilder) {
        console.log(builder.current);

        while(builder.going) {
            yourtakingtoolong();

            // console.log(builder.current)

            if(!builder.checkValue(...Keyword.modifierKeywords)) break;

            this.body.push(builder.readElement(Keyword));
        }

        builder.finish();
    }
}