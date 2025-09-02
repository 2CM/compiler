import { Token } from "../../Tokenizer/Token";
import { create, yourtakingtoolong } from "../../Utils/Utils";
import { Body } from "../Body";
import { Expression } from "../Expression";
import { ExpressionList } from "../ExpressionList";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";

export class IfStatement extends LineContent {
    ifConditions: Zingle[] = [];
    ifBodies: Body[] = [];
    elseBody: Body;

    static match(tokens: Token[], i: number) {
        return tokens[i].value == "if";
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initialize(tokens, startIndex, this);

        while(i < tokens.length) {
            let ifCondition: Zingle | null = null;
            let ifBody: Body | null = null;
            let canSkipCondition: boolean = false; //i feel like a tsa agent
            let skippedCondition: boolean = false;

            yourtakingtoolong();

            if(tokens[i].value == "else") {
                if(self.ifBodies.length == 0) throw new Error("weird else")

                canSkipCondition = true;

                i++;
            }

            if(tokens[i].value == "if") {
                i++;

                if(tokens[i].checkValueOrThrow("(")) {
                    ifCondition = Expression.fromTokens(tokens, ++i);

                    if(ifCondition instanceof ExpressionList && ifCondition.list.length == 0) {
                        throw new Error("empty if condition")
                    }

                    i = ifCondition.endIndex + 1;
                }
            } else if(canSkipCondition) {
                skippedCondition = true;
            } else {
                break;

                // throw new Error("tried to skip if statement") //getting stopped at tsa
            }

            if(tokens[i].checkValueOrThrow("{")) {
                i++;

                ifBody = Body.fromTokens(tokens, i);
                i = ifBody.endIndex + 1;
            }

            if(!ifBody) throw new Error("no if body");

            if(skippedCondition) {
                self.elseBody = ifBody;

                break;
            }

            if(!ifCondition) throw new Error("no if condition");
            
            self.ifConditions.push(ifCondition);
            self.ifBodies.push(ifBody);
        }

        self.endIndex = i;
        
        return self;
    }
}