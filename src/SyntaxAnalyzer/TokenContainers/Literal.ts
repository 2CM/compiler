import { IL } from "../../IL/IL";
import { IEmitsIl, IlEmitter } from "../../IntermediateCodeGenerator/IlEmitter";
import { Token } from "../../Tokenizer/Token";
import { colorWithType, create } from "../../Utils/Utils";
import { TokenContainer } from "../TokenContainer";

export class Literal extends TokenContainer<string | number | boolean> implements IEmitsIl {
    static transformValue(value: string) {
        return (
            !Number.isNaN(+value) ? +value :
            ["true", "false"].includes(value as string) ? Boolean(value) :
            value
        );
    }

    inlineToString() {
        return `(${colorWithType(this.value)})`;
    }

    emitIl(emitter: IlEmitter) {
        switch(typeof(this.value)) {
            case "number": emitter.emit(IL.Opcode.Ldc_i4, this.value); break;
            case "string": emitter.emit(IL.Opcode.Ldstr, this.value); break;
        }
    }
}