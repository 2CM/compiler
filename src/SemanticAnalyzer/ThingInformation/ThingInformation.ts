export class ThingInformation {
    parent?: ThingInformation;
    name?: string;

    constructor(parent: ThingInformation) {
        this.parent = parent;
    }
}