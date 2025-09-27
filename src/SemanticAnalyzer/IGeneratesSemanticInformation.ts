import { ClassInformation } from "./ThingInformation/ClassInformation";
import { NamespaceInformation } from "./ThingInformation/NamespaceInformation";
import { ThingInformation } from "./ThingInformation/ThingInformation";

export interface IGeneratesSemanticInformation<T> {
    generateSemanticInformation(path: (NamespaceInformation | ClassInformation)[], parent?: ThingInformation): void;
    generateSemanticOutline?(parent: ThingInformation): void;

    semanticInformation: T
}