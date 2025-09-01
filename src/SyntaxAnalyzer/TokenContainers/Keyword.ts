import { color, syntaxColors } from "../../Utils/Utils";
import { TokenReferenceElement } from "../TokenReferenceElement";

export class Keyword extends TokenReferenceElement<string> {
    static create = () => new this();

    inlineToString() {
        return `(${color(this.value, syntaxColors.name)})`
    }
}