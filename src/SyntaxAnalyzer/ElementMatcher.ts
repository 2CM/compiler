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

    checkType(type: TokenType) {
        return this.tokens[this.i].type == type;
    }

    checkValue(value: any) {
        return this.tokens[this.i].value == value;
    }
    
    matchElementOptional<T extends SyntacticElement>(elementType: new () => T, lazy: boolean = true) {
        if(this.skip) return;

        let newMatcher = new ElementMatcher(this.tokens, this.i, lazy);

        if((elementType as any as typeof SyntacticElement).match(newMatcher)) {
            this.i = newMatcher.i;

            return true;
        }

        return false;
    }

    matchElement<T extends SyntacticElement>(elementType: new () => T, lazy: boolean = true) {
        if(this.skip) return;

        if(this.matchElement(elementType)) return true;
        
        this.result = false;
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

    matchTypeOptional(...types: TokenType[]) {
        if(this.skip) return;

        for(let type of types) {
            if(this.tokens[this.i].type == type) {
                this.i++;

                return true;
            }
        }

        return false;
    }

    matchType(...types: TokenType[]) {
        if(this.skip) return;

        if(this.matchTypeOptional(...types)) return true;

        this.result = false;
        return false;
    }

    invalidate() {
        // console.log("invalid")

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