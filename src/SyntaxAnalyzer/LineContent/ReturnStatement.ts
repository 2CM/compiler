import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { Expression } from "../Expression";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";

export class ReturnStatement extends LineContent {
    value: Zingle;

    static fromTokens(tokens: Token[], startIndex: number) {
        let i = startIndex;
        let self = create(new ReturnStatement(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });
        
        if(tokens[i].checkValueOrThrow("return")) i++;

        if(tokens[i].value != ";") {
            let zingle = Expression.fromTokens(tokens, i);

            self.value = zingle;
            i = zingle.endIndex;
        }

        self.endIndex = i;

        return self;
    }
}