import { ThingInformation } from "./ThingInformation";
import { ClassInformation } from "./ClassInformation";

export class NamespaceInformation extends ThingInformation {
    namespaces: Record<string, NamespaceInformation> = {};
    classes: Record<string, ClassInformation> = {};
}