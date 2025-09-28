import { Token } from "../Tokenizer/Token";
import { ElementBuilder } from "./ElementBuilder";
import { ModifierList } from "./ModifierList";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";
import { Type } from "./Type";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { MemberInformation } from "../SemanticAnalyzer/ThingInformation/MemberInformation";

export class Member extends SyntacticElement implements IGeneratesSemanticInformation<MemberInformation> {
    modifiers: ModifierList;
    type: Type;
    name: Identifier;

    semanticInformation: MemberInformation;
    
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

    generateSemanticInformation(parent: ClassInformation) {}
}

//avoid circular dependency
import { Field } from "./Field";
import { Method } from "./Method";