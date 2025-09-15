import { ElementBuilder } from "./SyntaxAnalyzer/ElementBuilder";
import { Expression } from "./SyntaxAnalyzer/Expression";
import { SyntaxTree } from "./SyntaxAnalyzer/SyntaxTree";
import { Zingle } from "./SyntaxAnalyzer/Zingle";
import { Token } from "./Tokenizer/Token";
import { create } from "./Utils/Utils";

// var tokenized = Token.stringToTokens(`
// class a {
//     Int32 a() {
//         Int32<T, U> zingle = 4 + 2;
//     }
// }
// `);
// var tokenized = Token.stringToTokens(`zingle <bujh<a,b,c>, zim> (2);`);
var tokenized = Token.stringToTokens(`
public static class Bello extends bongle, zongle {
    Int32 fieldbuh = 6 + 2;

    Int32 Bingle<Zingle>(Int32<T> buh = 5 + 2) {
        buh<T,T2>();

        return true;
    }
}
`);

let tree = ElementBuilder.readFromTokens(tokenized, 0, SyntaxTree);

tree.registerIdentifiers();

// console.log(JSON.stringify(tree, (key: string, value: any) => key == "tokenSource" ? "buh" : value, "    "))

console.log(tree);



// console.log(Field.fromTokens(Token.stringToTokens(`Int32<Thing> buh;`), 0));