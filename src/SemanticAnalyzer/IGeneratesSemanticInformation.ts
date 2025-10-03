import { ThingInformation } from "./ThingInformation/ThingInformation";

export interface IGeneratesSemanticInformation<T> {
    generateSemanticInformation(parent: ThingInformation): void;
    generateSemanticOutline?(parent: ThingInformation): void;

    semanticInformation: T;
}