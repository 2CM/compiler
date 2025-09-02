import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Body } from "./Body";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { Parameter } from "./Parameter";
import { SyntacticElement } from "./SyntacticElement";
import { Variable } from "./Variable";

export class Method extends SyntacticElement {
    attributes: Keyword[] = [];
    returnType: Identifier;
    name: Identifier;
    parameters: Parameter[] = [];
    body: Body;

    static match(tokens: Token[], i: number) {
        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].type == TokenType.Keyword) {
                i++;
            } else {
                break;
            }
        }

        return (
            tokens[i++].type == TokenType.Identifier &&
            tokens[i++].type == TokenType.Identifier && 
            tokens[i++].value == "("
        )
    }

    static fromTokens(tokens: Token[], startIndex: number): Method {
        let [self, i] = super.initialize(tokens, startIndex, this);

        //attributes
        i = Keyword.advancePastAttributes(tokens, startIndex, self.attributes)
        
        //return type and name
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.returnType = Identifier.fromTokens(tokens, i++);
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);
        
        //parameters
        tokens[i++].checkValueOrThrow("(");
        
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

        tokens[i++].checkValueOrThrow(")");

        //body
        tokens[i++].checkValueOrThrow("{");

        let body = Body.fromTokens(tokens, i);
        
        self.body = body;
        self.endIndex = body.endIndex + 1;

        return self;
    }
}