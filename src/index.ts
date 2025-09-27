import { SemanticTree } from "./SemanticAnalyzer/SemanticTree";
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
namespace A.C.D {
    public class Class1<T, U> {}
}

namespace A.C {
    namespace D {
        public class Class3 {}
    }
    
    public class Class4<T, U> extends A.C.D.Class1<T, D.Class3> {
        U zingle(Class4 a, A.C.D.Class1 b) {}
    }
}
`);


let tree = ElementBuilder.readFromTokens(tokenized, 0, SyntaxTree);

// tree.registerIdentifiers();

// console.log(JSON.stringify(tree, (key: string, value: any) => key == "tokenSource" ? "buh" : value, "    "))

// console.log(tree);

let semanticTree = new SemanticTree();

tree.generateSemanticOutline(semanticTree.root);
tree.generateSemanticInformation([semanticTree.root]);

console.log(semanticTree);



// console.log(Field.fromTokens(Token.stringToTokens(`Int32<Thing> buh;`), 0));