import { TokenType } from "../../Tokenizer/Token";
import { ElementBuilder } from "../ElementBuilder";
import { ElementMatcher } from "../ElementMatcher";
import { Expression } from "../Expression";
import { SyntacticElement } from "../SyntacticElement";
import { Identifier } from "../TokenContainers/Identifier";
import { Type } from "../Type";
import { Zingle } from "../Zingle";

export class LocalDeclaration extends SyntacticElement {
    type: Type;
    name: Identifier;
    defaultValue?: Zingle;

    static match(matcher: ElementMatcher) {
        matcher.matchElementOptional(Type, false);
        matcher.matchType(TokenType.Identifier);

        return matcher.finish();
    }

    static read(self: LocalDeclaration, builder: ElementBuilder) {
        self.type = builder.readElement(Type);
        self.name = builder.readElement(Identifier);

        if(builder.advancePastValue("=")) {
            self.defaultValue = builder.readElement(Expression);
        }

        return builder.finish();
    }
}