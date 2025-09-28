import { ignoreInLogging } from "../../Utils/Utils";

export class ThingInformation {
    @ignoreInLogging()
    parentThing?: ThingInformation;
    name?: string;

    constructor(parent: ThingInformation) {
        this.parentThing = parent;
    }
}