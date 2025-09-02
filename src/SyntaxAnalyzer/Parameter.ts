import { Token, TokenType } from "../Tokenizer/Token";
import { create } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";
import { Variable } from "./Variable";

export class Parameter extends Variable {
    static match(tokens: Token[], i: number) {
        return super.match(tokens, i, false);
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initializeVariable(tokens, startIndex, this, false);

        tokens[i].checkValueOrThrow(",", ")");

        self.endIndex = i;

        return self;
    }
}