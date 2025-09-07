import { Token, TokenType } from "../Tokenizer/Token";
import { create } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";
import { ElementBuilder } from "./ElementBuilder";
import { Type } from "./Type";

export class Parameter extends SyntacticElement {
    type: Type;
    name: Identifier;
    defaultValue: Zingle;

    static read(self: Parameter, builder: ElementBuilder) {
        self.type = builder.readElement(Type);
        self.name = builder.readElement(Identifier);
        
        if(builder.advancePastValue("=")) {
            self.defaultValue = builder.readElement(Expression);
        }

        return builder.finish();
    }
}