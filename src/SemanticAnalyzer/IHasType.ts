import { Scope } from "./Scope";
import { TypeReference } from "./TypeReference";

/*
argument,
local,
field,
method,

*/

export interface IHasType {
    typeReference?: TypeReference;
    determineTypeReference(scope: Scope): void;
}