import { IEmitsIl, IlEmitter } from "../../IntermediateCodeGenerator/IlEmitter";
import { Token } from "../../Tokenizer/Token";
import { color, colorWithType, create, enumValue, syntaxColors } from "../../Utils/Utils";
import { Operation } from "../Operation";
import { TokenContainer } from "../TokenContainer";

export class Operator extends TokenContainer<Operation> implements IEmitsIl {
    @enumValue(Operator, Operation)
    declare value: Operation;

    static transformValue(value: string) {
        return Operation.convertOperatorToOperation(value);
    }

    inlineToString() {
        return `(${color(Operation[this.value], syntaxColors.name)}, ${colorWithType(`"${this.tokenSection()}"`)})`;
    }

    emitIl(emitter: IlEmitter) {
        
    }
}