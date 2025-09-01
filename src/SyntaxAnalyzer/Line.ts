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

const keywordToLineContentCreator: Record<string, typeof SyntacticElement.fromTokens> = {
    "return": ReturnStatement.fromTokens,
    "break": BreakStatement.fromTokens,
    "continue": ContinueStatement.fromTokens,
    "switch": SwitchStatement.fromTokens,
    "if": IfStatement.fromTokens,
    "for": ForStatement.fromTokens,
}

export class Line extends SyntacticElement {
    body: Expression | LineContent;

    static fromTokens(tokens: Token[], startIndex: number): Line {
        let i = startIndex;
        let self = create(new Line(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        let lineContentCreator = keywordToLineContentCreator[tokens[i].value];

        if(lineContentCreator) {
            let instance = lineContentCreator(tokens, i);

            self.body = instance;
            i = instance.endIndex;
        } else if(
            tokens[i].type == TokenType.Identifier &&
            tokens[i + 1].type == TokenType.Identifier
        ) {
            let instance = LocalDeclaration.fromTokens(tokens, i);

            self.body = instance;
            i = instance.endIndex;
        } else {
            let expression = Expression.fromTokens(tokens, i) as Expression;

            self.body = expression;
            i = expression.endIndex;
        }

        while(tokens[i].value == ";") {
            yourtakingtoolong();

            i++;
        }

        self.endIndex = i;

        return self;
    }
}