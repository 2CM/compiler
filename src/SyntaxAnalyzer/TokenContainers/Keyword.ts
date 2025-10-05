import { IHasType } from "../../SemanticAnalyzer/IHasType";
import { Scope } from "../../SemanticAnalyzer/Scope";
import { ClassInformation } from "../../SemanticAnalyzer/ThingInformation/ClassInformation";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { Token, TokenType } from "../../Tokenizer/Token";
import { color, syntaxColors, yourtakingtoolong } from "../../Utils/Utils";
import { Class } from "../Class";
import { TokenContainer } from "./TokenContainer";


//class|return|public|private|protected|override|virtual|abstract|static|extends|if|else|switch|case|default|break|continue|for|while|until|instance
//public|private|protected|static|instance|virtual|override|abstract|class|extends|if|else|switch|case|default|for|while|until|break|continue|return
export class Keyword extends TokenContainer<string> implements IHasType {
    static tokenType = TokenType.Keyword;
    
    typeReference?: TypeReference;

    static modifierKeywords = new Set([
        "public",
        "private",
        "protected",
        
        "static",
        "instance",
        
        "virtual",
        "override",
        "abstract",
    ])

    static syntaxKeywords = new Set([
        "class",

        "if",
        "else",

        "switch",
        "case",
        "default",

        "for",
        "while",
        "until",

        "break",
        "continue",

        "return",
    ])

    static zingleKeywords = new Set([
        "this",
        "base",
    ])

    static typeKeywords = new Set([
        "sbyte",
        "short",
        "int",
        "long",
        
        "byte",
        "ushort",
        "uint",
        "ulong",

        "half",
        "float",
        "double",

        "char",
        "string",

        "void",
        "null"
    ])

    static keywords = [...this.modifierKeywords, ...this.syntaxKeywords, ...this.zingleKeywords, ...this.typeKeywords];

    determineTypeReference(scope: Scope) {
        switch(this.value) {
            case "this":
                while(scope.parentScope) {
                    scope = scope.parentScope;

                    if(scope.semanticInformation instanceof ClassInformation) {
                        this.typeReference = scope.semanticInformation.createTypeReference();
                        
                        return;
                    }
                }

                throw new Error("incorrect use of this keyword");
        }
    }

    // static advancePastAttributes(tokens: Token[], i: number, array?: Keyword[]): number {
    //     while(i < tokens.length) {
    //         yourtakingtoolong();
    
    //         if(!this.modifierKeywords.has(tokens[i].value)) break;

    //         array?.push(Keyword.fromTokens(tokens, i));

    //         i++;
    //     }

    //     return i;
    // }

    inlineToString() {
        return `(${color(this.value, syntaxColors.name)})`
    }
}