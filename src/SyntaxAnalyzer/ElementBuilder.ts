import { Token, TokenType } from "../Tokenizer/Token";
import { create } from "../Utils/Utils";
import { Field } from "./Field";
import { SyntacticElement } from "./SyntacticElement";

export class ElementBuilder {
    element: SyntacticElement;
    tokens: Token[];
    i: number;

    constructor(element: SyntacticElement) {
        this.element = element;
        this.tokens = element.tokenSource;
        this.i = element.startIndex;
    }

    get current() {
        return this.tokens[this.i];
    }
    
    get going() {
        return this.i < this.tokens.length;
    }

    static initialize<T extends SyntacticElement>(tokens: Token[], startIndex: number, constructor: new () => T): [T, ElementBuilder] {
        let element = create(new constructor(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });
        
        return [element, new ElementBuilder(element)];
    }

    matchElement<T extends SyntacticElement>(elementType: new () => T): boolean {
        return (elementType as any as typeof SyntacticElement).match(this.tokens, this.i);
    }

    matchExpectedElement<T extends SyntacticElement>(elementType: new () => T): boolean {
        if(this.matchElement(elementType)) return true;

        throw new Error(`expected ${elementType.name}`)
    }
    
    readElement<T extends SyntacticElement>(elementType: new () => T): T {
        let element = create(new elementType(), obj => {
            obj.tokenSource = this.tokens
            obj.startIndex = this.i
        });
        
        let builder = create(new ElementBuilder(element), obj => {
            obj.i = this.i
            obj.tokens = this.tokens
        });

        element.read(builder);

        this.i = element.endIndex;

        return element as T;
    }

    continueReadingAs<T extends SyntacticElement>(elementType: new () => T): void {
        (this.element as any).__proto__ = elementType.prototype;
        // this.element.__constructor = elementType.constructor;
        // this.element.constructor.call(this.element)
        // elementType.constructor.call(this.element);

        console.log(elementType.name)

        this.element.read.call(this.element, this);
    }

    readElementFromPossibilities<T extends (typeof SyntacticElement)[]>(possibleElements: T): InstanceType<T[number]> | null {
        for(let possibleElement of possibleElements) {
            if(this.matchElement(possibleElement)) {
                return this.readElement(possibleElement) as InstanceType<T[number]>;
            }
        }

        return null;
    }

    checkValue(...values: string[]) {
        for(let value of values) {
            if(this.current.value == value) return true;
        }
        
        return false;
    }

    advance() {
        this.i++;
    }

    advancePastValue(value: string) {
        if(this.current.value == value) {
            this.i++;

            return true;
        }

        return false;
    }

    advancePastExpectedValue(value: string) {
        if(this.advancePastValue(value)) return true;

        throw new Error(`expected ${value}`);
    }

    checkType(type: TokenType) {
        return this.current.type == type;
    }

    advancePastType(type: TokenType) {
        if(this.current.type == type) {
            this.i++;

            return true;
        }

        return false;
    }

    advancePastExpectedType(type: TokenType) {
        if(this.advancePastType(type)) return true;

        throw new Error(`expected ${type}`);
    }

    finish() {
        this.element.endIndex = this.i;

        return this.element;
    }
}