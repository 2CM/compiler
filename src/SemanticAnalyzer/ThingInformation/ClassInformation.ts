import type { FieldInformation } from "./FieldInformation"
import type { MethodInformation } from "./MethodInformation"
import { ThingInformation } from "./ThingInformation";
import { TypeReference } from "../TypeReference";
import { TypeParameterInformation } from "./TypeParameterInformation";

export class ClassInformation extends ThingInformation {
    typeParameters: TypeParameterInformation[] = [];
    extends: TypeReference[] = [];

    classes: Record<string, ClassInformation> = {};
    fields: Record<string, FieldInformation> = {};
    methods: Record<string, MethodInformation> = {};
}