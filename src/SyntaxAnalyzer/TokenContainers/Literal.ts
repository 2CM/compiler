import { Token } from "../../Tokenizer/Token";
import { colorWithType, create } from "../../Utils/Utils";
import { TokenContainer } from "../TokenContainer";

export class Literal extends TokenContainer<string | number | boolean> {
    static transformValue(value: string) {
        return (
            !Number.isNaN(+value) ? +value :
            ["true", "false"].includes(value as string) ? Boolean(value) :
            value
        );
    }

    inlineToString() {
        return `(${colorWithType(this.value)})`
    }
}