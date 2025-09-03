import { Token, TokenType } from "../Tokenizer/Token";
import { Generic } from "./Generic";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";

export class Type extends SyntacticElement {
    value: Identifier;
    generic: Generic;

    static match(tokens: Token[], i: number) {
        return tokens[i].type == TokenType.Identifier;
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initialize(tokens, startIndex, this);

        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.value = Identifier.fromTokens(tokens, i++);

        if(Generic.match(tokens, i)) {
            self.generic = Generic.fromTokens(tokens, i);

            i = self.generic.endIndex;
        }

        self.endIndex = i;

        return self;
    }
}