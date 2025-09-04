import { Token } from "../Tokenizer/Token";
import { color, create, syntaxColors } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";

export class TokenReferenceElement<T = any> extends SyntacticElement {
    value: T;

    static create = (): TokenReferenceElement => new TokenReferenceElement();

    read(builder: ElementBuilder) {
        this.value = builder.current.value as T;

        builder.advance();

        builder.finish();

        // return create(this, obj => {
        //     obj.startIndex = startIndex
        //     obj.endIndex = startIndex + 1
        //     obj.tokenSource = tokens
        //     obj.value = tokens[startIndex].value
        // })
    }

    inlineToString() {
        return `(${color(this.value, syntaxColors.value)})`
    }
}