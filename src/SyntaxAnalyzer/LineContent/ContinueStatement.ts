import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { LineContent } from "./LineContent";

export class ContinueStatement extends LineContent {
    static match(tokens: Token[], i: number) {
        return tokens[i].value == "continue";
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initialize(tokens, startIndex, this);
        
        tokens[i++].checkValueOrThrow("continue");
        tokens[i].checkValueOrThrow(";");

        self.endIndex = i;

        return self;
    }
}