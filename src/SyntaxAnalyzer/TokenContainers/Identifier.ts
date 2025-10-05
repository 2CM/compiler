import { IL } from "../../IL/IL";
import { IEmitsIl, IlEmitter } from "../../IntermediateCodeGenerator/IlEmitter";
import { IdentifierInformation, IdentifierReferenceType } from "../../SemanticAnalyzer/IHasScope";
import { IHasType } from "../../SemanticAnalyzer/IHasType";
import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { TokenType } from "../../Tokenizer/Token";
import { ElementMatcher } from "../ElementMatcher";
import { Expression } from "../Expressions/Expression";
import { TokenContainer } from "./TokenContainer";

export class Identifier extends TokenContainer<string> implements Expression, IEmitsIl, IHasType {
    static tokenType = TokenType.Identifier;
    
    typeReference: TypeReference;

    determineTypeReference(scope: Scope) {
        this.typeReference = scope.getIdentifierInformation(this.value).type;
    }

    emitIl(emitter: IlEmitter) {
        // let identifierInformation: IdentifierInformation | null = null;

        // for(let i = emitter.scopes.length - 1; i >= 0; i--) {
        //     let scope = emitter.scopes[i];

        //     identifierInformation = scope.identifiers[this.value];

        //     if(identifierInformation) break;
        // }

        // if(!identifierInformation) throw new Error("what is that identifier");

        // switch(identifierInformation.referenceType) {
        //     case IdentifierReferenceType.Local:
        //         emitter.emit(IL.Opcode.Ldloc, identifierInformation.id);
        //     break;
            
        //     case IdentifierReferenceType.Argument:
        //         emitter.emit(IL.Opcode.Ldarg, identifierInformation.id);
        //     break;
        //     case IdentifierReferenceType.Field:

        //     break;
        //     case IdentifierReferenceType.Method:

        //     break;
        //     case IdentifierReferenceType.Type:

        //     break;
        // }
    }
}