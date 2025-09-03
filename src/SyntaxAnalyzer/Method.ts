import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Body } from "./Body";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { Parameter } from "./Parameter";
import { SyntacticElement } from "./SyntacticElement";
import { Variable } from "./Variable";
import { Type } from "./Type";
import { Generic } from "./Generic";
import { Member } from "./Member";

export class Method extends SyntacticElement {
    attributes: Keyword[] = [];
    returnType: Type;
    name: Identifier;
    generic: Generic;
    parameters: Parameter[] = [];
    body: Body;

    static match(tokens: Token[], i: number) {
        i = Keyword.advancePastAttributes(tokens, i);

        console.log(tokens[i]);
        if(Type.match(tokens, i)) {
            let type = Type.fromTokens(tokens, i);

            i = type.endIndex;
        } else {
            return false;
        }


        if(tokens[i++].type != TokenType.Identifier) return false;

        if(Generic.match(tokens, i)) {
            let generic = Generic.fromTokens(tokens, i);

            i = generic.endIndex
        }

        return tokens[i].value == "(";
    }

    static fromTokens(tokens: Token[], startIndex: number): Method {
        let [self, i] = super.initialize(tokens, startIndex, this);

        //attributes
        i = Keyword.advancePastAttributes(tokens, startIndex, self.attributes)
        
        //return type and name
        if(Type.match(tokens, i)) {
            self.returnType = Type.fromTokens(tokens, i);

            i = self.returnType.endIndex;
        } else {
            throw new Error("expected type")
        }
        
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);
        
        if(Generic.match(tokens, i)) {
            self.generic = Generic.fromTokens(tokens, i);

            i = self.generic.endIndex;
        }

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