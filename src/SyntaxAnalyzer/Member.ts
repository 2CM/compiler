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

    static read(self: Member, builder: ElementBuilder) {
        if(builder.matchElement(ModifierList)) {
            self.modifiers = builder.readElement(ModifierList);
        }
        
        self.type = builder.readElement(Type);
        self.name = builder.readElement(Identifier);

        if(builder.checkValue("(", "<")) {
            return builder.continueReadingAs(Method);
        } else {
            return builder.continueReadingAs(Field);
        }
    }
}