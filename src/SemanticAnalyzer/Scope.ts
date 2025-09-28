import { IdentifierInformation } from "./IHasScope";
import { ThingInformation } from "./ThingInformation/ThingInformation";

export class Scope {
    parentScope?: Scope;
    identifiers: Record<string, IdentifierInformation> = {};
    semanticInformation: ThingInformation;

    constructor(semanticInformation: ThingInformation, parent?: Scope) {
        this.semanticInformation = semanticInformation;
        this.parentScope = parent;
    }

    getIdentifierInformation(identifier: string): IdentifierInformation {
        let information = this.identifiers[identifier] ?? this.parentScope?.getIdentifierInformation(identifier);

        if(information) return information;

        throw new Error(`couldnt find identifier ${identifier}`);
    }
}