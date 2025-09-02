import { SyntaxTree } from "./SyntaxAnalyzer/SyntaxTree";
import { Token } from "./Tokenizer/Token";
import { hexToRGB } from "./Utils/Utils";

// var tokenized = Token.stringToTokens(`
// public static class Bello extends bongle, zongle {
//     Int32 fieldbuh = 6 + 2;

//     Int32 Bingle(Int32 buh, Int32 ouh) {
//         float buh = 4;
//     }
// }
// `);
var tokenized = Token.stringToTokens(`
public static class Bello extends bongle, zongle {
    Int32 fieldbuh = 6 + 2;

    Int32 Bingle(Int32 buh, Int32 ouh) {
        switch(zong) {
            case 1:
                if(you == true) {
                    continue;
                }
                break;
            default:
                for(int i = 2; i < 2; i += 2) {
                    print.bingle[1];
                }
        }

        return true;
    }
}
`);

var tree = SyntaxTree.fromTokens(tokenized);

console.log(tree);