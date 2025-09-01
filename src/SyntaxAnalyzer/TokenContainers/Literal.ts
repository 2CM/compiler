import { Token } from "../../Tokenizer/Token";
import { colorWithType, create } from "../../Utils/Utils";
import { TokenReferenceElement } from "../TokenReferenceElement";

export class Literal extends TokenReferenceElement<string | number | boolean> {
    static create = () => new this();

    static fromTokens(tokens: Token[], startIndex: number) {
        return create(super.fromTokens(tokens, startIndex), obj => {
            obj.value = 
                !Number.isNaN(+obj.value) ? +obj.value :
                ["true", "false"].includes(obj.value as string) ? Boolean(obj.value) :
                obj.value
        });
    }

    inlineToString() {
        return `(${colorWithType(this.value)})`
    }
}