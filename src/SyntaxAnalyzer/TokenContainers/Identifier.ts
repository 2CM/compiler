import { TokenReferenceElement } from "../TokenReferenceElement";

export class Identifier extends TokenReferenceElement<string> {
    static create = () => new this();
}