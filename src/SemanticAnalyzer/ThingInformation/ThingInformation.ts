import { ignoreInLogging } from "../../Utils/Utils";

export class ThingInformation {
    @ignoreInLogging()
    parent?: ThingInformation;
    name?: string;

    constructor(parent: ThingInformation) {
        this.parent = parent;
    }
}