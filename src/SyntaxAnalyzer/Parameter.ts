import { Token, TokenType } from "../Tokenizer/Token";
import { create } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";

export class Parameter extends SyntacticElement {
    type: Identifier;
    name: Identifier;
    defaultValue: Zingle;

    static fromTokens(tokens: Token[], startIndex: number) {
        let i = startIndex;
        let self = create(new Parameter(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.type = Identifier.fromTokens(tokens, i++);
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);
        
        //check this
        if(tokens[i].value == "=") {
            let zingle = Expression.fromTokens(tokens, ++i);

            self.defaultValue = zingle;
            i = zingle.endIndex;
        }

        if(![",", ")"].includes(tokens[i].value)) {
            throw new Error("what");
        }

        self.endIndex = i;

        return self;
    }
}