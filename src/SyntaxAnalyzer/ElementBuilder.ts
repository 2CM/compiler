import { Token, TokenType } from "../Tokenizer/Token";
import { create } from "../Utils/Utils";
import { ElementMatcher } from "./ElementMatcher";
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

    applyMetadataToElement(element: SyntacticElement) {
        element.tokenSource = this.tokens;
        element.startIndex = this.i;
    }

//#region matching
    matchElement<T extends SyntacticElement>(elementType: new () => T, lazy: boolean = true): boolean {
        if(!this.going) return false;

        return (elementType as any as typeof SyntacticElement).match(new ElementMatcher(this.tokens, this.i, lazy));
    }

    matchExpectedElement<T extends SyntacticElement>(elementType: new () => T): boolean {
        if(this.matchElement(elementType)) return true;

        throw this.throwExpectedError(elementType.name.quote());
    }

    matchValue(...values: string[]) {
        return values.some(element => this.current?.value == element);
    }

    matchExpectedValue(...values: string[]) {
        if(this.matchValue(...values)) return true;

        throw this.throwExpectedError(values.map(value => value.quote()).joinInEnglish("or"));
    }

    matchType(...types: TokenType[]) {
        return types.some(element => this.current?.type == element);
    }

    matchExpectedType(...types: TokenType[]) {
        if(this.matchType(...types)) return true;

        throw this.throwExpectedError(types.map(type => TokenType[type].quote()).joinInEnglish("or"));
    }
//#endregion matching

//#region reading
    static readFromTokens<T extends SyntacticElement>(tokens: Token[], startIndex: number, elementType: new () => T): T {
        let element = create(new elementType(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        let builder = new ElementBuilder(element);

        return builder.readElement(elementType)
    }

    readElement<T extends SyntacticElement>(elementType: new () => T): T {
        let element = new elementType();
        this.applyMetadataToElement(element);
        
        let builder = new ElementBuilder(element);
        
        let outElement = (elementType as any as typeof SyntacticElement).read(element, builder);

        this.i = outElement.endIndex;

        return outElement as T;
    }

    continueReadingAs<T extends SyntacticElement>(elementType: typeof SyntacticElement): T {
        (this.element as any).__proto__ = elementType.prototype;

        return elementType.read(this.element, this) as T;
    }

    readElementFromPossibilities<T extends (typeof SyntacticElement)[]>(possibleElements: T): InstanceType<T[number]> | null {
        for(let possibleElement of possibleElements) {
            if(this.matchElement(possibleElement)) {
                // console.log(possibleElement.name)

                return this.readElement(possibleElement) as InstanceType<T[number]>;
            }
        }

        return null;
    }
//#endregion reading
    
//#region advancing
    advance() {
        this.i++;
    }

    advanceIf(condition: boolean) {
        if(condition) {
            this.advance();

            return true;
        }

        return false;
    }

    advancePastValue(...values: string[]) {
        return this.advanceIf(this.matchValue(...values));
    }

    advancePastExpectedValue(...values: string[]) {
        return this.advanceIf(this.matchExpectedValue(...values));
    }

    advancePastType(...types: TokenType[]) {
        return this.advanceIf(this.matchType(...types));
    }

    advancePastExpectedType(...types: TokenType[]) {
        return this.advanceIf(this.matchExpectedType(...types));
    }
//#endregion advancing

    throwExpectedError(str: string) {
        throw new Error(`Expected ${str} at "${this.tokens[this.i].value}"`)
    }

    finish() {
        this.element.endIndex = this.i;

        return this.element;
    }
}