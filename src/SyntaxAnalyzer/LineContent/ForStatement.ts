import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { Body } from "../Body";
import { ElementBuilder } from "../ElementBuilder";
import { Expression } from "../Expression";
import { Line } from "../Line";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";

export class ForStatement extends LineContent {
    initialization: Line;
    condition: Line;
    increment: Zingle;
    body: Body;

    static keyword = "for";

    static read(self: ForStatement, builder: ElementBuilder) {
        builder.advancePastExpectedValue("for");
        builder.advancePastExpectedValue("(");
        
        self.initialization = builder.readElement(Line);
        self.condition = builder.readElement(Line);
        self.increment = builder.readElement(Expression);
        
        builder.advancePastExpectedValue(")");
        builder.advancePastExpectedValue("{");
        
        self.body = builder.readElement(Body);

        builder.advancePastExpectedValue("}")

        return builder.finish();
    }
}