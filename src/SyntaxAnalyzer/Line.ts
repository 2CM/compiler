import { Token } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Expression } from "./Expression";
import { IfStatement } from "./LineContent/IfStatement";
import { LocalDeclaration } from "./LineContent/LocalDeclaration";
import { ReturnStatement } from "./LineContent/ReturnStatement";
import { SyntacticElement } from "./SyntacticElement";

export class Line extends SyntacticElement {
    body: Expression | LocalDeclaration | ReturnStatement | IfStatement;

    static fromTokens(tokens: Token[], startIndex: number): Line {
        let i = startIndex;
        let self = create(new Line(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        if(tokens[i].value == "return") {
            let returnStatement = ReturnStatement.fromTokens(tokens, i);

            self.body = returnStatement;
            i = returnStatement.endIndex;
        } else if(tokens[i].value == "if") {
            let ifStatement = IfStatement.fromTokens(tokens, i);

            self.body = ifStatement;
            i = ifStatement.endIndex;
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