import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Class } from "./Class";
import { SyntacticElement } from "./SyntacticElement";

export class SyntaxTree extends SyntacticElement {
    body: Class[] = [];

    static fromTokens(tokens: Token[], startIndex: number = 0): SyntaxTree {
        let self = create(new SyntaxTree(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });
        let i = startIndex;

        let thingStart = startIndex;

        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == "class") {
                let class_ = Class.fromTokens(tokens, thingStart);

                self.body.push(class_)

                i = class_.endIndex;
                thingStart = class_.endIndex;
            } else if(tokens[i].checkTypeOrThrow(TokenType.Keyword)) {
                i++;
            }
        }

        self.endIndex = i;

        return self;
    }
}