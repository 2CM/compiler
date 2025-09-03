import { Field } from "./SyntaxAnalyzer/Field";
import { Generic } from "./SyntaxAnalyzer/Generic";
import { SyntaxTree } from "./SyntaxAnalyzer/SyntaxTree";
import { Token } from "./Tokenizer/Token";
import { hexToRGB } from "./Utils/Utils";

var tokenized = Token.stringToTokens(`
public static class Bello<T> extends bongle<T>, zongle<T> {
    Dictionary<string, Int32> fieldbuh = 6 + 2;

    Dictionary<string, Float32> Bingle<T>(Int32 buh, Int32 ouh) {
        float buh = 4;
    }
}
`);
// var tokenized = Token.stringToTokens(`
// public static class Bello extends bongle, zongle {
//     Int32 fieldbuh = 6 + 2;

//     Int32 Bingle(Int32 buh, Int32 ouh) {
//         switch(zong) {
//             case 1:
//                 if(you == true) {
//                     continue;
//                 }
//                 break;
//             default:
//                 for(int i = 2; i < 2; i += 2) {
//                     print.bingle[1];
//                 }
//         }

//         return true;
//     }
// }
// `);

var tree = SyntaxTree.fromTokens(tokenized);

console.log(tree);


// console.log(Field.fromTokens(Token.stringToTokens(`Int32<Thing> buh;`), 0));