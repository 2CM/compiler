import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { ElementBuilder } from "../ElementBuilder";
import { LineContent } from "./LineContent";

export class ContinueStatement extends LineContent {
    static keyword = "continue";

    static read(self: ContinueStatement, builder: ElementBuilder) {
        builder.advancePastExpectedValue("continue");

        return builder.finish();
    }
}