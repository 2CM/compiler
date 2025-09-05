import { Token } from "../../Tokenizer/Token";
import { create, yourtakingtoolong } from "../../Utils/Utils";
import { Body } from "../Body";
import { ElementBuilder } from "../ElementBuilder";
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

    static read(self: IfStatement, builder: ElementBuilder) {
        while(builder.going) {
            let ifCondition: Zingle | null = null;
            let ifBody: Body | null = null;
            let canSkipCondition: boolean = false; //i feel like a tsa agent
            let skippedCondition: boolean = false;

            yourtakingtoolong();

            if(builder.advancePastValue("else")) {
                if(self.ifBodies.length == 0) throw new Error("weird else")

                canSkipCondition = true;
            }

            if(builder.advancePastValue("if")) {
                builder.advancePastExpectedValue("(");
            
                ifCondition = builder.readElement(Expression);

                if(ifCondition instanceof ExpressionList && ifCondition.list.length == 0) {
                    throw new Error("empty if condition")
                }
            } else if(canSkipCondition) {
                skippedCondition = true;
            } else {
                break;

                // throw new Error("tried to skip if statement") //getting stopped at tsa
            }

            builder.advancePastExpectedValue(")");
            builder.advancePastExpectedValue("{");

            ifBody = builder.readElement(Body);
            builder.advance();

            if(!ifBody) throw new Error("no if body");

            if(skippedCondition) {
                self.elseBody = ifBody;

                break;
            }

            if(!ifCondition) throw new Error("no if condition");
            
            self.ifConditions.push(ifCondition);
            self.ifBodies.push(ifBody);
        }
        
        return builder.finish();
    }
}