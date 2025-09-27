import { MemberInformation } from "./MemberInformation";
import { ParameterInformation } from "./ParameterInformation";

export class MethodInformation extends MemberInformation {
    generics: string[] = [];
    parameters: ParameterInformation[] = [];
}