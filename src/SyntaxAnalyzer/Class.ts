import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Field } from "./Field";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { Method } from "./Method";
import { SyntacticElement } from "./SyntacticElement";
import { Generic } from "./Generic";
import { Type } from "./Type";

export class Class extends SyntacticElement {
    attributes: Keyword[] = [];
    name: Identifier;
    generic: Generic;
    extends: Type[] = [];
    body: (Method | Field)[] = [];

    static match(tokens: Token[], i: number) {
        i = Keyword.advancePastAttributes(tokens, i);
        
        return tokens[i].value == "class";
    }

    static fromTokens(tokens: Token[], startIndex: number) {
        let [self, i] = super.initialize(tokens, startIndex, this);

        //attributes
        i = Keyword.advancePastAttributes(tokens, i, self.attributes)

        tokens[i++].checkValueOrThrow("class");
        
        //class name
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);
        
        //generic
        if(Generic.match(tokens, i)) {
            let generic = Generic.fromTokens(tokens, i);

            self.generic = generic;
            i = generic.endIndex;
        }

        //inheritance
        if(tokens[i].value == "extends") {
            i++;
            
            while(i < tokens.length) {
                if(Type.match(tokens, i)) {
                    let type = Type.fromTokens(tokens, i);

                    self.extends.push(type);
                    i = type.endIndex;
                } else {
                    throw new Error("expected type")
                }
                
                if(tokens[i].value == ",") {
                    i++;
                } else {
                    break;
                }
            }
        }
        
        tokens[i++].checkValueOrThrow("{");

        //body
        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == "}") {
                self.endIndex = i + 1;

                break;
            }

            let element = SyntacticElement.fromPossibleElements(tokens, i, [Field, Method]);

            if(element) {
                self.body.push(element);
                i = element.endIndex;
            } else {
                throw new Error("bad");
            }
        }

        return self;
    }
}