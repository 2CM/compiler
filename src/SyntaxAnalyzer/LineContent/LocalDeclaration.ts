import { Token, TokenType } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { Expression } from "../Expression";
import { Identifier } from "../TokenContainers/Identifier";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";

export class LocalDeclaration extends LineContent {
    type: Identifier;
    name: Identifier;
    defaultValue: Zingle;

    static fromTokens(tokens: Token[], startIndex: number) {
        let i = startIndex;
        let self = create(new LocalDeclaration(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.type = Identifier.fromTokens(tokens, i++);
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);

        if(tokens[i++].value == "=") {
            let zingle = Expression.fromTokens(tokens, i);

            self.defaultValue = zingle;
            i = zingle.endIndex;
        }
        
        tokens[i].checkValueOrThrow(";");

        self.endIndex = i;

        return self;
    }
}