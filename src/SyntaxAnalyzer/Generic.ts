import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";
import { Variable } from "./Variable";
import { Type } from "./Type";

export class Generic extends SyntacticElement {
    types: Type[] = [];

    static match(tokens: Token[], i: number) {
        return tokens[i].value == "<";
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initialize(tokens, startIndex, this);

        tokens[i++].checkValueOrThrow("<");

        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == ">") break;

            if(Type.match(tokens, i)) {
                let type = Type.fromTokens(tokens, i);
                
                self.types.push(type);
                i = type.endIndex;

                tokens[i].checkValueOrThrow(",", ">");
                
                if(tokens[i].value == ",") i++;
            } else {
                throw new Error("expected type")
            }
        }

        self.endIndex = i + 1;

        return self;
    }
}