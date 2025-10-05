import { TokenType } from "../../Tokenizer/Token";
import { TokenContainer } from "./TokenContainer";

export class Separator extends TokenContainer<string> {
    static tokenType = TokenType.Separator;
}