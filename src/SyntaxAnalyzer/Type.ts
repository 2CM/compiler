import { Token, TokenType } from "../Tokenizer/Token";
import { ElementBuilder } from "./ElementBuilder";
import { ElementMatcher } from "./ElementMatcher";
import { Generic } from "./Generic";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";

export class Type extends SyntacticElement {
    name: Identifier;
    generic: Generic;

    static match(matcher: ElementMatcher) {
        matcher.matchType(TokenType.Identifier);

        return matcher.finish();
    }

    static read(self: Type, builder: ElementBuilder) {
        self.name = builder.readElement(Identifier);

        if(builder.matchElement(Generic)) {
            self.generic = builder.readElement(Generic);
        }

        return builder.finish();
    }

    toString(): string {
        return this.name.value + (this.generic ? `<${this.generic.toString()}>` : "")
    }
}