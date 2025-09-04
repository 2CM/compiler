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

    read(builder: ElementBuilder) {
        this.value = builder.readElement(Identifier);

        if(builder.matchElement(Generic)) {
            this.generic = builder.readElement(Generic);
        }

        builder.finish();
    }
}