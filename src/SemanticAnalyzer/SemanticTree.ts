import { NamespaceInformation } from "./ThingInformation/NamespaceInformation";

export class SemanticTree {
    root: NamespaceInformation;

    constructor() {
        this.root = new NamespaceInformation();
        this.root.name = "[ROOT]";
    }
}