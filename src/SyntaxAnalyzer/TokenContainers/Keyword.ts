import { Token } from "../../Tokenizer/Token";
import { color, syntaxColors, yourtakingtoolong } from "../../Utils/Utils";
import { TokenReferenceElement } from "../TokenReferenceElement";


//class|return|public|private|protected|override|virtual|abstract|static|extends|if|else|switch|case|default|break|continue|for|while|until|instance
//public|private|protected|static|instance|virtual|override|abstract|class|extends|if|else|switch|case|default|for|while|until|break|continue|return
export class Keyword extends TokenReferenceElement<string> {
    static create = () => new this();

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
        "extends",

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

    static keywords = [...this.modifierKeywords, ...this.syntaxKeywords];

    static advancePastAttributes(tokens: Token[], i: number, array?: Keyword[]): number {
        while(i < tokens.length) {
            yourtakingtoolong();
    
            if(!this.modifierKeywords.has(tokens[i].value)) break;

            array?.push(Keyword.fromTokens(tokens, i));

            i++;
        }

        return i;
    }

    inlineToString() {
        return `(${color(this.value, syntaxColors.name)})`
    }
}