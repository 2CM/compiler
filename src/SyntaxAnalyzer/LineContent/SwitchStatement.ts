import { Token, TokenType } from "../../Tokenizer/Token";
import { create, yourtakingtoolong } from "../../Utils/Utils";
import { Body } from "../Body";
import { ElementBuilder } from "../ElementBuilder";
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

    static read(self: SwitchSection, builder: ElementBuilder) {
        if(builder.advancePastValue("case")) {
            if(builder.checkType(TokenType.Operator)) {
                self.operator = builder.readElement(Operator);
            }

            self.value = builder.readElement(Expression);
        } else {
            builder.advancePastExpectedValue("default");
        }

        builder.advancePastExpectedValue(":");

        self.body = builder.readElement(Body);

        return builder.finish();
    }
}

export class SwitchStatement extends LineContent {
    switchExpression: Zingle;
    body: SwitchSection[] = [];

    static keyword = "switch";

    static read(self: SwitchStatement, builder: ElementBuilder) {
        builder.advancePastExpectedValue("switch");
        builder.advancePastExpectedValue("(");

        self.switchExpression = builder.readElement(Expression);

        builder.advancePastExpectedValue(")")
        builder.advancePastExpectedValue("{")
        
        //todo: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/selection-statements#case-guards
        
        while(builder.going) {
            yourtakingtoolong();
            
            if(builder.checkValue("}")) {
                break;
            }
            
            self.body.push(builder.readElement(SwitchSection));
        }

        builder.advancePastExpectedValue("}");
        
        return builder.finish();
    }
}