import { Token } from "../../Tokenizer/Token";
import { color, colorWithType, create, syntaxColors } from "../../Utils/Utils";
import { Operation } from "../Operation";
import { TokenReferenceElement } from "../TokenReferenceElement";

export class Operator extends TokenReferenceElement<Operation> {
    static create = () => new this();

    static fromTokens(tokens: Token[], startIndex: number) {
        return create(super.fromTokens(tokens, startIndex), obj => {
            obj.value = Operation.convertOperatorToOperation(tokens[startIndex].value)
        });
    }

    inlineToString() {
        return `(${color(Operation[this.value], syntaxColors.name)}, ${colorWithType(`"${this.tokenSection()}"`)})`
    }
}