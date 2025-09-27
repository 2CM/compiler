import { ThingInformation } from "./ThingInformation";
import { TypeReference } from "../TypeReference";

export class MemberInformation extends ThingInformation {
    type: TypeReference;
    static: boolean;
}