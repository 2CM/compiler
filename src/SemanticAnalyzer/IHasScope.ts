import { enumValue } from "../Utils/Utils";

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
    referenceType: IdentifierReferenceType
    id: string | number
    typeId?: string

    constructor(referenceType: IdentifierReferenceType, id: string | number, typeId?: string) {
        this.referenceType = referenceType;
        this.id = id;
        this.typeId = typeId;
    }
}

export type IdentifierMap = Record<string, IdentifierInformation>

export interface IHasScope {
    identifiers: IdentifierMap
    registerIdentifiers: (...data: any[]) => number | void;
}

export function hasScope(obj: any): obj is IHasScope {
    return obj.registerIdentifiers != null;
}