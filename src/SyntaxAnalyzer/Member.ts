import { Token } from "../Tokenizer/Token";
import { ElementBuilder } from "./ElementBuilder";
import { Field } from "./Field";
import { Method } from "./Method";
import { ModifierList } from "./ModifierList";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";
import { Type } from "./Type";

export class Member extends SyntacticElement {
    modifiers: ModifierList;
    type: Type;
    name: Identifier;

    read(builder: ElementBuilder) {
        if(builder.matchElement(ModifierList)) {
            this.modifiers = builder.readElement(ModifierList);
        }
        
        this.type = builder.readElement(Type);
        this.name = builder.readElement(Identifier);

        if(builder.checkValue("(", "<")) {
            builder.continueReadingAs(Method);
        } else {
            builder.continueReadingAs(Field);
        }

        builder.finish();
    }
}