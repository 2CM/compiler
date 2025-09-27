import { ThingInformation } from "./ThingInformation";
import { TypeReference } from "../TypeReference";

export class ParameterInformation extends ThingInformation {
    type: TypeReference;
}