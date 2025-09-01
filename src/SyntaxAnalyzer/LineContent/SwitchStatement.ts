import { Token, TokenType } from "../../Tokenizer/Token";
import { create, yourtakingtoolong } from "../../Utils/Utils";
import { Body } from "../Body";
import { Expression } from "../Expression";
import { ExpressionList } from "../ExpressionList";
import { SyntacticElement } from "../SyntacticElement";
import { Operator } from "../TokenContainers/Operator";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";

export class SwitchSection extends SyntacticElement {
    operator: Operator | null;
    value: Zingle | null;
    body: Body;
}

export class SwitchStatement extends LineContent {
    switchExpression: Zingle;
    body: SwitchSection[] = [];

    static fromTokens(tokens: Token[], startIndex: number) {
        let i = startIndex;
        let self = create(new SwitchStatement(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        tokens[i++].checkValueOrThrow("switch");
        tokens[i++].checkValueOrThrow("(");

        let switchExpression = Expression.fromTokens(tokens, i);
        i = switchExpression.endIndex;

        i++;

        tokens[i++].checkValueOrThrow("{");

        //todo: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/selection-statements#case-guards

        while(i < tokens.length) {
            yourtakingtoolong();

            console.log("b: ", tokens[i])

            if(tokens[i].value == "}") {
                break;
            }

            let section = create(new SwitchSection(), obj => {
                obj.startIndex = i
                obj.tokenSource = tokens
                self.body.push(obj)
            });

            if(tokens[i].value == "case") {
                i++;
                
                if(tokens[i].type == TokenType.Operator) {
                    section.operator = Operator.fromTokens(tokens, i++);
                }

                section.value = Expression.fromTokens(tokens, i);
                i = section.value.endIndex;
            } else {
                tokens[i++].checkValueOrThrow("default")
            }

            tokens[i++].checkValueOrThrow(":");

            section.body = Body.fromTokens(tokens, i, true)
            i = section.body.endIndex;
            section.endIndex = i;
        }

        self.endIndex = i + 1;
        
        return self;
    }
}