import { SemanticTree } from "./SemanticAnalyzer/SemanticTree";
import { ElementBuilder } from "./SyntaxAnalyzer/ElementBuilder";
import { Expression } from "./SyntaxAnalyzer/Expression";
import { SyntaxTree } from "./SyntaxAnalyzer/SyntaxTree";
import { Type } from "./SyntaxAnalyzer/Type";
import { Zingle } from "./SyntaxAnalyzer/Zingle";
import { Token } from "./Tokenizer/Token";
import { create, ignoreInLogging } from "./Utils/Utils";

// var tokenized = Token.stringToTokens(`
// class a {
//     Int32 a() {
//         Int32<T, U> zingle = 4 + 2;
//     }
// }
// `);
// var tokenized = Token.stringToTokens(`zingle <bujh<a,b,c>, zim> (2);`);
// var tokenized = Token.stringToTokens(`
// namespace A;

// namespace C {
//     namespace D;

//     public class Class1<T, U> {}
// }

// namespace C {
//     namespace D {
//         public class Class3 {}
//     }
    
//     public class Class4<T, U> : A.C.D.Class1<T, D.Class3> {
//         D.Class1<U, D.Class3> zingle(Class4 a, A.C.D.Class1 b) {}
//     }
// }
// `);

var tokenized = Token.stringToTokens(`
namespace System {
    public class Int32 {}
    public class String {}
}

public class Animal {
    public int Age;
    public int SomeOtherThing;

    public int Buh(int zuh) {

    }
}

public class Dog : Animal {
    public int Teeth; //i need to find a better way of testing this

    public int DoSomething(int bingleBuh, Animal enemy) {
        int z = enemy.SomeOtherThing;
    
        bingleBuh + Teeth + Age - 1 + z;
    }
}
`);


let tree = ElementBuilder.readFromTokens(tokenized, 0, SyntaxTree);

// tree.registerIdentifiers();

// console.log(JSON.stringify(tree, (key: string, value: any) => key == "tokenSource" ? "buh" : value, "    "))

// console.log(tree);

let semanticTree = new SemanticTree();

tree.generateSemanticOutline(semanticTree.root);

Type.registerSystemTypes(semanticTree);
tree.generateSemanticInformation(semanticTree.root);


tree.registerIdentifiers();

// console.log(semanticTree);
console.log(tree);


// console.log(Field.fromTokens(Token.stringToTokens(`Int32<Thing> buh;`), 0));