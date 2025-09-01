import { SyntaxTree } from "./SyntaxAnalyzer/SyntaxTree";
import { Token } from "./Tokenizer/Token";
import { hexToRGB } from "./Utils/Utils";

// var tokenized = Token.stringToTokens(`
// public static class Bello extends bongle, zongle {
//     Int32 fieldbuh = 6 + 2;

//     Int32 Bingle(Int32 buh, Int32 ouh) {
//         if(5 + 2) {

//         }
//     }
// }
// `);
var tokenized = Token.stringToTokens(`
public static class Bello extends bongle, zongle {
    Int32 fieldbuh = 6 + 2;

    Int32 Bingle(Int32 buh, Int32 ouh) {
        switch(5 + 2) {
            case < yes:
                5 + 5;

                break;
            case no:
                1 + 1;
            case maybe:
                1 + 1;

                break;
            default:
                return;
        }

        if(5 + 2) {
            continue;
        }

        return true;
    }
}
`);

var tree = SyntaxTree.fromTokens(tokenized);

console.log(tree);