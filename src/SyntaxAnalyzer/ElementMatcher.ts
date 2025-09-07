import { Token, TokenType } from "../Tokenizer/Token";
import { SyntacticElement } from "./SyntacticElement";

export class ElementMatcher {
    tokens: Token[];
    i: number;

    lazy: boolean = false;
    skip: boolean = false;
    result: boolean = true;

    get going() {
        return this.i < this.tokens.length && !this.skip;
    }

    constructor(tokens: Token[], i: number, lazy: boolean) {
        this.tokens = tokens;
        this.i = i;
        this.lazy = lazy;
    }
    
    matchElementOptional<T extends SyntacticElement>(elementType: new () => T) {
        if(this.skip) return;

        let newMatcher = new ElementMatcher(this.tokens, this.i, true);

        if((elementType as any as typeof SyntacticElement).match(newMatcher)) {
            this.i = newMatcher.i;

            return true;
        }

        return false;
    }

    matchValueOptional(...values: string[]) {
        if(this.skip) return;

        for(let value of values) {
            if(this.tokens[this.i].value == value) {
                this.i++;

                return true;
            }
        }

        return false;
    }

    matchValue(...values: string[]) {
        if(this.skip) return;
        
        if(this.matchValueOptional(...values)) return true;
        
        this.result = false;
        return false;
    }

    matchTypeOptional(type: TokenType) {
        if(this.skip) return;

        this.tokens[this.i];

        if(this.tokens[this.i].type == type) {
            this.i++;

            return true;
        }

        return false;
    }

    matchType(type: TokenType) {
        if(this.skip) return;

        if(this.matchTypeOptional(type)) return true;

        this.result = false;
        return false;
    }

    invalidate() {
        console.log("invalid")

        this.result = false;
        this.skip = true;
    }

    finishLazy() {
        if(this.lazy) {
            this.skip = true;
        }
    }
    
    finish() {
        return this.result;
    }
}