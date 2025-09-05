import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { ElementBuilder } from "../ElementBuilder";
import { Expression } from "../Expression";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";

export class ReturnStatement extends LineContent {
    value: Zingle;

    static match(tokens: Token[], i: number) {
        return tokens[i].value == "return";
    }

    static read(self: ReturnStatement, builder: ElementBuilder) {
        builder.advancePastExpectedValue("return")

        if(!builder.checkValue(";")) {
            self.value = builder.readElement(Expression);
        }

        return builder.finish();
    }
}