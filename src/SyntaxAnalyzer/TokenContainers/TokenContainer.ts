import { Token, TokenType } from "../../Tokenizer/Token";
import { color, create, syntaxColors } from "../../Utils/Utils";
import { ElementBuilder } from "../ElementBuilder";
import { ElementMatcher } from "../ElementMatcher";
import { SyntacticElement } from "../SyntacticElement";

export class TokenContainer<T = any> extends SyntacticElement {
    static tokenType: TokenType;
    value: T;

    static transformValue(value: string): any {
        return value;
    }

    static match(matcher: ElementMatcher): boolean {
        matcher.matchType(this.tokenType);

        return matcher.finish();
    }

    static read(self: TokenContainer, builder: ElementBuilder) {
        self.value = this.transformValue(builder.current.value);

        builder.advance();

        return builder.finish();
    }

    inlineToString() {
        return `(${color(this.value, syntaxColors.value)})`
    }
}