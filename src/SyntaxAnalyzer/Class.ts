import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Field } from "./Field";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { Method } from "./Method";
import { SyntacticElement } from "./SyntacticElement";
import { Generic } from "./Generic";
import { Type } from "./Type";
import { ElementBuilder } from "./ElementBuilder";
import { Member } from "./Member";
import { ModifierList } from "./ModifierList";

export class Class extends SyntacticElement {
    modifiers: ModifierList;
    name: Identifier;
    generic: Generic;
    extends: Type[] = [];
    body: Member[] = [];

    read(builder: ElementBuilder) {
        //modifiers
        if(builder.matchElement(ModifierList)) {
            this.modifiers = builder.readElement(ModifierList);
        }

        builder.advancePastExpectedValue("class");

        
        //class name
        this.name = builder.readElement(Identifier);

        //generics
        if(builder.matchElement(Generic)) {
            this.generic = builder.readElement(Generic);
        }

        //inheritance
        if(builder.advancePastValue("extends")) {
            while(builder.going) {
                this.extends.push(builder.readElement(Type));
                
                if(!builder.advancePastValue(",")) break;
            }
        }
        
        builder.advancePastExpectedValue("{")

        //body
        while(builder.going) {
            yourtakingtoolong();

            if(builder.advancePastValue("}")) break;

            this.body.push(builder.readElement(Member));

            // let element = SyntacticElement.fromPossibleElements(tokens, i, [Field, Method]);

            // if(element) {
            //     self.body.push(element);
            //     i = element.endIndex;
            // } else {
            //     throw new Error("bad");
            // }
        }

        return builder.finish();
    }
}