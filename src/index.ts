import { ElementBuilder } from "./SyntaxAnalyzer/ElementBuilder";
import { Expression } from "./SyntaxAnalyzer/Expression";
import { SyntaxTree } from "./SyntaxAnalyzer/SyntaxTree";
import { Zingle } from "./SyntaxAnalyzer/Zingle";
import { Token } from "./Tokenizer/Token";
import { create } from "./Utils/Utils";

var tokenized = Token.stringToTokens(`
public static class Bello<T, T> {
    Int32<t, t> buh() {
        if(5 + 5) {
            return;
        }
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
//         }

//         return true;
//     }
// }
// `);

let tree = create(new SyntaxTree(), obj => {
    obj.tokenSource = tokenized;
});
let builder = new ElementBuilder(tree);

// console.log(JSON.stringify(tree, (key: string, value: any) => key == "tokenSource" ? "buh" : value, "    "))

console.log(SyntaxTree.read(tree, builder));



// console.log(Field.fromTokens(Token.stringToTokens(`Int32<Thing> buh;`), 0));