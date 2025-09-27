import { Expression } from "./Expression";
import { Zingle } from "./Zingle";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";
import { IHasScope } from "../SemanticAnalyzer/IHasScope";
import { IHasId } from "../SemanticAnalyzer/IHasId";
import { Member } from "./Member";
import { ICreatesIlThing } from "../IntermediateCodeGenerator/ICreatesIlThing";
import { IL } from "../IL/IL";
import { isBigIntObject } from "util/types";
import { create } from "../Utils/Utils";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { FieldInformation } from "../SemanticAnalyzer/ThingInformation/FieldInformation";
import { Keyword } from "./TokenContainers/Keyword";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";

export class Field extends Member implements IHasId, ICreatesIlThing<IL.Field>, IGeneratesSemanticInformation<FieldInformation> {
    defaultValue?: Zingle;
    
    id: string;

    declare semanticInformation: FieldInformation;

    static read(self: Field, builder: ElementBuilder) {
        if(builder.advancePastValue("=")) {
            self.defaultValue = builder.readElement(Expression);
        }

        builder.advancePastExpectedValue(";");

        return builder.finish();
    }

    createId(parentId: string) {
        this.id = `${this.type.toString()} ${parentId}.${this.name.value}`;
    }

    createIlThing(offset: number) {
        return create(new IL.Field(), obj => {
            // obj.attributes = this.modifiers.createIlThing();
            // obj.type = this.type.name.value;
            // obj.name = this.name.value;
            // obj.offset = offset;
        })
    }

    generateSemanticInformation(path: (NamespaceInformation | ClassInformation)[], parent: ClassInformation) {
        parent.fields[this.name.value] = create(new FieldInformation(), obj => {
            obj.name = this.name.value;
            obj.type = this.type.getTypeReference(path);

            this.semanticInformation = obj;
        })
    }
}