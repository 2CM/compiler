import { ClassInformation } from "./ThingInformation/ClassInformation";
import { TypeParameterInformation } from "./ThingInformation/TypeParameterInformation";

export class TypeReference {
    typeParameter: TypeParameterInformation;

    class: ClassInformation;
    generic: TypeReference[] = [];
}