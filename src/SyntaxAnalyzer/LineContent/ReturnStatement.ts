import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { Expression } from "../Expression";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";

export class ReturnStatement extends LineContent {
    value: Zingle;

    static match(tokens: Token[], i: number) {
        return tokens[i].value == "return";
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initialize(tokens, startIndex, this);
        
        tokens[i++].checkValueOrThrow("return");

        if(tokens[i].value != ";") {
            let zingle = Expression.fromTokens(tokens, i);

            self.value = zingle;
            i = zingle.endIndex;
        }

        self.endIndex = i;

        return self;
    }
}