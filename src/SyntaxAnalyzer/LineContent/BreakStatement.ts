import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { LineContent } from "./LineContent";

export class BreakStatement extends LineContent {
    static fromTokens(tokens: Token[], startIndex: number) {
        let i = startIndex;
        let self = create(new BreakStatement(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });
        
        tokens[i++].checkValueOrThrow("break");
        tokens[i].checkValueOrThrow(";");

        self.endIndex = i;

        return self;
    }
}