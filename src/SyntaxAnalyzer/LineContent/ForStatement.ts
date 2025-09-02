import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { Body } from "../Body";
import { Expression } from "../Expression";
import { Line } from "../Line";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";


export class ForStatement extends LineContent {
    initialization: Line;
    condition: Line;
    increment: Zingle;
    body: Body;

    static match(tokens: Token[], i: number) {
        return tokens[i].value == "for";
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initialize(tokens, startIndex, this);
        
        tokens[i++].checkValueOrThrow("for");
        tokens[i++].checkValueOrThrow("(");
        
        self.initialization = Line.fromTokens(tokens, i);
        i = self.initialization.endIndex;
        
        self.condition = Line.fromTokens(tokens, i);
        i = self.condition.endIndex;

        self.increment = Expression.fromTokens(tokens, i);
        i = self.increment.endIndex;
        
        tokens[i++].checkValueOrThrow(")");
        tokens[i++].checkValueOrThrow("{");
        
        self.body = Body.fromTokens(tokens, i);
        i = self.body.endIndex;

        tokens[i++].checkValueOrThrow("}");

        self.endIndex = i;

        return self;
    }
}