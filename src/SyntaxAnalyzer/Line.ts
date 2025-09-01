import { Token } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Expression } from "./Expression";
import { IfStatement } from "./LineContent/IfStatement";
import { LineContent } from "./LineContent/LineContent";
import { BreakStatement } from "./LineContent/BreakStatement";
import { ReturnStatement } from "./LineContent/ReturnStatement";
import { SwitchStatement } from "./LineContent/SwitchStatement";
import { SyntacticElement } from "./SyntacticElement";
import { ContinueStatement } from "./LineContent/ContinueStatement";

const keywordToLineContentCreator: Record<string, typeof SyntacticElement.fromTokens> = {
    "return": ReturnStatement.fromTokens,
    "break": BreakStatement.fromTokens,
    "continue": ContinueStatement.fromTokens,
    "switch": SwitchStatement.fromTokens,
    "if": IfStatement.fromTokens,
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