import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Body } from "./Body";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { Parameter } from "./Parameter";
import { SyntacticElement } from "./SyntacticElement";

export class Method extends SyntacticElement {
    attributes: Keyword[] = [];
    returnType: Identifier;
    name: Identifier;
    parameters: Parameter[] = [];
    body: Body;

    static fromTokens(tokens: Token[], startIndex: number): Method {
        let i = startIndex;
        let self = create(new Method(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].type == TokenType.Keyword) {
                self.attributes.push(Keyword.fromTokens(tokens, i++));
            } else if(tokens[i].type == TokenType.Identifier) {
                break;
            }
        }
        
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.returnType = Identifier.fromTokens(tokens, i++);
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);
        if(tokens[i].checkValueOrThrow("(")) i++;

        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == ")") {
                break;
            }

            let parameter = Parameter.fromTokens(tokens, i);

            self.parameters.push(parameter);

            i = parameter.endIndex;

            if(tokens[i].value == ",") {
                i++;
            }
        }

        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == "{") {
                let body = Body.fromTokens(tokens, i);
                
                self.body = body;
                self.endIndex = body.endIndex;

                break;
            }

            i++;
        }

        return self;
    }
}