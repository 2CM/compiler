import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";

export abstract class Variable extends SyntacticElement {
    attributes?: Keyword[] = [];
    name: Identifier;
    type: Identifier;
    defaultValue: Zingle;

    static match(tokens: Token[], i: number, hasAttributes: boolean = false) {
        if(hasAttributes) 
            i = Keyword.advancePastAttributes(tokens, i);

        return (
            tokens[i++].type == TokenType.Identifier &&
            tokens[i++].type == TokenType.Identifier &&
            tokens[i++].value != "("
        )
    }

    static initializeVariable<T extends Variable>(tokens: Token[], startIndex: number, constructor: new () => T, hasAttributes: boolean): [T, number] {
        let [self, i] = super.initialize(tokens, startIndex, constructor);

        if(hasAttributes) 
            i = Keyword.advancePastAttributes(tokens, i, self.attributes);
        
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.type = Identifier.fromTokens(tokens, i++);
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);

        if(tokens[i].value == "=") {
            let zingle = Expression.fromTokens(tokens, ++i);

            self.defaultValue = zingle;
            i = zingle.endIndex;
        }

        return [self, i];
    }
}