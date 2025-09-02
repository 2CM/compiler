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

    static fromTokens(tokens: Token[], startIndex: number): Line {
        let i = startIndex;
        let self = create(new Line(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        let element = SyntacticElement.fromPossibleElements(tokens, startIndex, lineContentClasses) ?? Expression.fromTokens(tokens, i);

        i = element.endIndex;
        self.body = element;

        while(tokens[i].value == ";") {
            yourtakingtoolong();

            i++;
        }

        self.endIndex = i;

        return self;
    }
}