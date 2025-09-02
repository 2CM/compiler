import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { LineContent } from "./LineContent";

export class BreakStatement extends LineContent {
    static match(tokens: Token[], i: number) {
        return tokens[i].value == "break";
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initialize(tokens, startIndex, this);
        
        tokens[i++].checkValueOrThrow("break");
        tokens[i].checkValueOrThrow(";");

        self.endIndex = i;

        return self;
    }
}