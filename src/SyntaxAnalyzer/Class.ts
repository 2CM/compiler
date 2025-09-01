import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Field } from "./Field";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { Method } from "./Method";
import { SyntacticElement } from "./SyntacticElement";

export class Class extends SyntacticElement {
    attributes: Keyword[] = [];
    name: Identifier;
    extends: Identifier[] = [];
    body: (Method | Field)[] = [];

    static fromTokens(tokens: Token[], startIndex: number): Class {
        let self = create(new Class(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });
        let i = startIndex;

        //attributes
        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == "class") {
                i++;

                break;
            } else if(tokens[i].checkTypeOrThrow(TokenType.Keyword)) {
                self.attributes.push(Keyword.fromTokens(tokens, i++));
            }
        }

        //class name
        if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) self.name = Identifier.fromTokens(tokens, i++);

        //inheritance
        if(tokens[i].value == "extends") {
            i++;

            while(i < tokens.length) {
                if(tokens[i].checkTypeOrThrow(TokenType.Identifier)) {
                    self.extends.push(Identifier.fromTokens(tokens, i++));
                }

                if(tokens[i].value == ",") {
                    i++;
                } else {
                    break;
                }
            }
        }

        if(tokens[i].checkValueOrThrow("{")) i++;

        //method or field
        let thingStart = i;

        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == "}") {
                if(thingStart != i) throw new Error("eijeij")

                self.endIndex = i + 1;

                break;
            }

            //kinda weird solution
            //go until you find something that isnt a keyword or token
            //if its a (, then you have a method
            //if not, you have a field
            //the error handling is handled in the method and field fromTokens functions themselves
            if([TokenType.Keyword, TokenType.Identifier].includes(tokens[i].type)) {
                i++;

                continue;
            } else {
                let thing = tokens[i].value == "(" ? Method.fromTokens(tokens, thingStart) : Field.fromTokens(tokens, thingStart)

                self.body.push(thing);

                i = thing.endIndex;
                thingStart = i;
            }
        }

        return self;
    }
}