import { SyntaxTree } from "./SyntaxAnalyzer/SyntaxTree";
import { Token } from "./Tokenizer/Token";
import { hexToRGB } from "./Utils/Utils";

var tokenized = Token.stringToTokens(`
public static class Bello extends bongle, zongle {
    Int32 fieldbuh = 6 + 2;

    Int32 Bingle(Int32 buh, Int32 ouh) {
        if(true) {
            return 5;
        } else if(true) {

        } else {

        }

        return true;
    }
}
`);

var tree = SyntaxTree.fromTokens(tokenized);

console.log(tree);