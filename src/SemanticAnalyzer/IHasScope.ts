import { SyntacticElement } from "../SyntaxAnalyzer/SyntacticElement";
import { enumValue } from "../Utils/Utils";
import { Scope } from "./Scope";
import { TypeReference } from "./TypeReference";

export enum IdentifierReferenceType {
    Local,
    Argument,
    Field,
    Method,
    Type,
}

// type IdentifierInformation<T extends IdentifierType> = T extends IdentifierType.Argument | IdentifierType.Local ?
//     {type: T, id: number} :
//     {type: T, id: string};

export class IdentifierInformation {
    @enumValue(IdentifierInformation, IdentifierReferenceType)
    referenceType: IdentifierReferenceType;
    name: string;
    typeReference: TypeReference;

    constructor(referenceType: IdentifierReferenceType, name: string, typeReference: TypeReference) {
        this.referenceType = referenceType;
        this.name = name;
        this.typeReference = typeReference;
    }
}

export interface IHasScope {
    scope: Scope;
    registerIdentifiers(parent: SyntacticElement): number | void;
}

export function hasScope(obj: any): obj is IHasScope {
    return obj.registerIdentifiers != null;
}