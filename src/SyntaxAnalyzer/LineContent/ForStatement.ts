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

    static fromTokens(tokens: Token[], startIndex: number) {
        let i = startIndex;
        let self = create(new ForStatement(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });
        
        tokens[i++].checkValueOrThrow("for");
        tokens[i++].checkValueOrThrow("(");

        
        self.initialization = Line.fromTokens(tokens, i);
        i = self.initialization.endIndex;
        
        console.log(tokens.slice(startIndex, i));
        
        self.condition = Line.fromTokens(tokens, i);
        i = self.condition.endIndex;

        console.log(tokens.slice(startIndex, i));
        
        self.increment = Expression.fromTokens(tokens, i);
        i = self.increment.endIndex;
        
        console.log(tokens.slice(startIndex, i));

        tokens[i++].checkValueOrThrow(")");
        tokens[i++].checkValueOrThrow("{");
        
        self.body = Body.fromTokens(tokens, i);
        i = self.body.endIndex;

        tokens[i++].checkValueOrThrow("}");

        self.endIndex = i;

        return self;
    }
}