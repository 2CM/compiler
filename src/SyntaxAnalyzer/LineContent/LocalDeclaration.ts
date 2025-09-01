import { Token } from "../../Tokenizer/Token";
import { create } from "../../Utils/Utils";
import { Identifier } from "../TokenContainers/Identifier";
import { Zingle } from "../Zingle";
import { LineContent } from "./LineContent";

export class LocalDeclaration extends LineContent {
    type: Identifier;
    name: Identifier;
    defaultValue: Zingle;

    static fromTokens(tokens: Token[], startIndex: number) {
        let i = startIndex;
        let self = create(new LocalDeclaration(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        return self;
    }
}