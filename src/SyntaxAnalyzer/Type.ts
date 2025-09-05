import { Token, TokenType } from "../Tokenizer/Token";
import { ElementBuilder } from "./ElementBuilder";
import { Generic } from "./Generic";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";

export class Type extends SyntacticElement {
    value: Identifier;
    generic: Generic;

    static match(tokens: Token[], i: number) {
        return tokens[i].type == TokenType.Identifier;
    }

    static read(self: Type, builder: ElementBuilder) {
        self.value = builder.readElement(Identifier);

        if(builder.matchElement(Generic)) {
            self.generic = builder.readElement(Generic);
        }

        return builder.finish();
    }
}