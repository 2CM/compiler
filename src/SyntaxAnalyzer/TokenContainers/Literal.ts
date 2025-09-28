import { IL } from "../../IL/IL";
import { IEmitsIl, IlEmitter } from "../../IntermediateCodeGenerator/IlEmitter";
import { IHasType } from "../../SemanticAnalyzer/IHasType";
import { Scope } from "../../SemanticAnalyzer/Scope";
import { ClassInformation } from "../../SemanticAnalyzer/ThingInformation/ClassInformation";
import { NamespaceInformation } from "../../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { Token } from "../../Tokenizer/Token";
import { colorWithType, create } from "../../Utils/Utils";
import { TokenContainer } from "../TokenContainer";

export class Literal extends TokenContainer<string | number | boolean> implements IEmitsIl, IHasType {
    typeReference: TypeReference;

    determineTypeReference(scope: Scope) {
        while(scope.parent) {
            scope = scope.parent;
        }

        let typeName = (
            typeof(this.value) == "number" ? "Int32" :
            typeof(this.value) == "string" ? "String" :
            typeof(this.value) == "boolean" ? "Boolean" :
            null
        );

        if(typeName == null) throw new Error("couldnt determine literal type");

        this.typeReference = new TypeReference();
        this.typeReference.class = (scope.semanticInformation as NamespaceInformation).classes[typeName];

        console.log(this.typeReference)
    }

    static transformValue(value: string) {
        return (
            !Number.isNaN(+value) ? +value :
            ["true", "false"].includes(value as string) ? Boolean(value) :
            value
        );
    }

    inlineToString() {
        return `(${colorWithType(this.value)})`;
    }

    emitIl(emitter: IlEmitter) {
        switch(typeof(this.value)) {
            case "number": emitter.emit(IL.Opcode.Ldc_i4, this.value); break;
            case "string": emitter.emit(IL.Opcode.Ldstr, this.value); break;
        }
    }
}