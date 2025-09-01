import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { LineContent } from "./LineContent";

export class ContinueStatement extends LineContent {
    static fromTokens(tokens: Token[], startIndex: number) {
        let i = startIndex;
        let self = create(new ContinueStatement(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });
        
        tokens[i++].checkValueOrThrow("continue");
        tokens[i].checkValueOrThrow(";");

        self.endIndex = i;

        return self;
    }
}