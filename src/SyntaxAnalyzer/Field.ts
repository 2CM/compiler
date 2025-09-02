import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";
import { Variable } from "./Variable";

export class Field extends Variable {
    attributes: Keyword[] = [];

    static match(tokens: Token[], i: number) {
        return super.match(tokens, i, true);
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initializeVariable(tokens, startIndex, this, true);

        tokens[i++].checkValueOrThrow(";")

        self.endIndex = i;

        return self;
    }
}