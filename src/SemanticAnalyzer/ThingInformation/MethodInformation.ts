import { create } from "../../Utils/Utils";
import { IdentifierInformation, IdentifierReferenceType } from "../IHasScope";
import { Scope } from "../Scope";
import { ClassInformation } from "./ClassInformation";
import { MemberInformation } from "./MemberInformation";
import { ParameterInformation } from "./ParameterInformation";

export class MethodInformation extends MemberInformation {
    generics: string[] = [];
    parameters: ParameterInformation[] = [];

    addToScope(scope: Scope, parent: ClassInformation) {
        scope.identifiers[this.name as string] = create(new IdentifierInformation(), obj => {
            obj.referenceType = IdentifierReferenceType.Method;
            obj.name = this.name as string;
            obj.type = this.type;
            obj.parentClass = parent;
        });
    }
}