import { Token } from "../../Tokenizer/Token";
import { color, colorWithType, create, syntaxColors } from "../../Utils/Utils";
import { Operation } from "../Operation";
import { TokenContainer } from "../TokenContainer";

export class Operator extends TokenContainer<Operation> {
    static transformValue(value: string) {
        return Operation.convertOperatorToOperation(value)
    }

    inlineToString() {
        return `(${color(Operation[this.value], syntaxColors.name)}, ${colorWithType(`"${this.tokenSection()}"`)})`
    }
}