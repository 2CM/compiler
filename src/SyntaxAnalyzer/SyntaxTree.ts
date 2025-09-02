import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Class } from "./Class";
import { SyntacticElement } from "./SyntacticElement";

export class SyntaxTree extends SyntacticElement {
    body: Class[] = [];

    static fromTokens(tokens: Token[], startIndex: number = 0) {
        let [self, i] = super.initialize(tokens, startIndex, this);

        while(i < tokens.length) {
            yourtakingtoolong();

            let element = SyntacticElement.fromPossibleElements(tokens, startIndex, [Class]);

            if(!element) throw new Error();

            self.body.push(element);
            i = element.endIndex;
        }

        self.endIndex = i;

        return self;
    }
}