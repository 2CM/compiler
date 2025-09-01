import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";

export class Field extends SyntacticElement {
    attributes: Keyword[] = [];
    name: Identifier;
    type: Identifier;
    defaultValue: Zingle;

    static fromTokens(tokens: Token[], startIndex: number): Field {
        let self = create(new Field(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });
        let i = startIndex;

        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].type == TokenType.Keyword) {
                self.attributes.push(Keyword.fromTokens(tokens, i++));
            } else if(tokens[i].type == TokenType.Identifier) {
                break;
            }
        }
        
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.type = Identifier.fromTokens(tokens, i++);
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);

        if(tokens[i].value == "=") {
            let zingle = Expression.fromTokens(tokens, ++i);

            self.defaultValue = zingle;
            i = zingle.endIndex;
        }
        
        if(tokens[i].checkValueOrThrow(";")) {
            i++;
        }

        self.endIndex = i;

        return self;
    }
}