import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { ElementBuilder } from "../ElementBuilder";
import { ElementMatcher } from "../ElementMatcher";
import { LineContent } from "./LineContent";

export class BreakStatement extends LineContent {
    static keyword = "break";

    static read(self: BreakStatement, builder: ElementBuilder) {
        builder.advancePastExpectedValue("break");

        return builder.finish();
    }
}