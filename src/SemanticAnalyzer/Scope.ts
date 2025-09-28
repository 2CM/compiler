import { IdentifierInformation } from "./IHasScope";
import { ThingInformation } from "./ThingInformation/ThingInformation";

export class Scope {
    parent?: Scope;
    identifiers: Record<string, IdentifierInformation> = {};
    semanticInformation: ThingInformation;

    constructor(semanticInformation: ThingInformation, parent?: Scope) {
        this.semanticInformation = semanticInformation;
        this.parent = parent;
    }

    getIdentifierInformation(identifier: string): IdentifierInformation {
        let information = this.identifiers[identifier] ?? this.parent?.getIdentifierInformation(identifier);

        if(information) return information;

        throw new Error(`couldnt find identifier ${identifier}`)
    }
}