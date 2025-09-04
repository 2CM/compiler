import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Expression } from "./Expression";
import { IfStatement } from "./LineContent/IfStatement";
import { LineContent } from "./LineContent/LineContent";
import { BreakStatement } from "./LineContent/BreakStatement";
import { ReturnStatement } from "./LineContent/ReturnStatement";
import { SwitchStatement } from "./LineContent/SwitchStatement";
import { SyntacticElement } from "./SyntacticElement";
import { ContinueStatement } from "./LineContent/ContinueStatement";
import { ForStatement } from "./LineContent/ForStatement";
import { LocalDeclaration } from "./LineContent/LocalDeclaration";
import { ElementBuilder } from "./ElementBuilder";

const lineContentClasses: typeof SyntacticElement[] = [
    ReturnStatement,
    BreakStatement,
    ContinueStatement,
    SwitchStatement,
    IfStatement,
    ForStatement,
    LocalDeclaration,
]

export class Line extends SyntacticElement {
    body: Expression | LineContent;

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, builder] = ElementBuilder.initialize(tokens, startIndex, this);

        self.body = builder.readElementFromPossibilities(lineContentClasses) ?? builder.readElement(Expression);

        while(builder.advancePastValue(";")) {
            yourtakingtoolong();
        }

        return builder.finish();
    }
}