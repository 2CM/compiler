import type { FieldInformation } from "./FieldInformation"
import type { MethodInformation } from "./MethodInformation"
import { ThingInformation } from "./ThingInformation";
import { TypeReference } from "../TypeReference";
import { TypeParameterInformation } from "./TypeParameterInformation";
import { MemberInformation } from "./MemberInformation";

export class ClassInformation extends ThingInformation {
    typeParameters: TypeParameterInformation[] = [];
    extends: TypeReference[] = [];

    classes: Record<string, ClassInformation> = {};
    fields: Record<string, FieldInformation> = {};
    methods: Record<string, MethodInformation> = {};

    getMember(name: string): MemberInformation | null {
        if(this.fields[name]) return this.fields[name];
        if(this.methods[name]) return this.methods[name];

        if(this.extends.length > 0) {
            let inheritedMember = this.extends[0].class.getMember(name);

            if(inheritedMember) return inheritedMember;
        }

        return null;
    }
}