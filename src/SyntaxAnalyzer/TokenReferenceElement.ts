import { Token } from "../Tokenizer/Token";
import { color, create, syntaxColors } from "../Utils/Utils";
import { SyntacticElement } from "./SyntacticElement";

export class TokenReferenceElement<T = any> extends SyntacticElement {
    value: T;

    static create = (): TokenReferenceElement => new TokenReferenceElement();

    static fromTokens(tokens: Token[], startIndex: number) {
        return create(this.create(), obj => {
            obj.startIndex = startIndex
            obj.endIndex = startIndex + 1
            obj.tokenSource = tokens
            obj.value = tokens[startIndex].value
        })
    }

    inlineToString() {
        return `(${color(this.value, syntaxColors.value)})`
    }
}