import { ClassInformation } from "./ThingInformation/ClassInformation";
import { TypeParameterInformation } from "./ThingInformation/TypeParameterInformation";

export class TypeReference {
    typeParameter: TypeParameterInformation;

    class: ClassInformation;
    generic: TypeReference[] = [];

    static compare(a?: TypeReference, b?: TypeReference): boolean {
        if(a == null || b == null) return false;

        return (
            (a.typeParameter == b.typeParameter && a.typeParameter != null) ||
            (a.class == b.class && a.generic.filter((_, i) => !this.compare(a.generic[i], b.generic[i])).length == 0)
        )
    }
}