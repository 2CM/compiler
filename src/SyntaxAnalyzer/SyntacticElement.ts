import { Token } from "../Tokenizer/Token";
import { create, getAnsiColorCode, ignoreInLogging, indentationString, syntaxColors } from "../Utils/Utils";
import { Zingle } from "./Zingle";

export class SyntacticElement {
    @ignoreInLogging()
    startIndex: number;

    @ignoreInLogging()
    endIndex: number;

    @ignoreInLogging()
    tokenSource: Token[];

    tokenSection = function(this: SyntacticElement, linePrefix: string = "") {
        let tokens = this.tokenSource;
        let str = "";
        let multiline = false;
        let indent = 0;
        let canDoMultiline = this.endIndex - this.startIndex > 5;
        let newLine = "\n" + linePrefix + indentationString + getAnsiColorCode(syntaxColors.string)

        for(let i = this.startIndex; i < this.endIndex; i++) {
            str += tokens[i].value;

            if(i == this.endIndex - 1) continue;
            if(tokens[i + 1]?.value.match(/[,.;:()[\]]/)) continue;
            if(tokens[i]?.value.match(/[([.!]/)) continue;

            str += " "

            if(!canDoMultiline) continue;

            if(["{", ";", ":", "}"].includes(tokens[i]?.value) && !["else"].includes(tokens[i + 1]?.value)) {
                str += newLine;

                if(["{"].includes(tokens[i].value)) {
                    indent++;
                }
                
                if("}".includes(tokens[i + 1]?.value)) {
                    indent--;

                    if(tokens[i].value == "{") {
                        str += newLine;
                    }
                } else if(!["{", ":"].includes(tokens[i].value)) {
                    str += newLine;
                }

                str += "  ".repeat(indent)

                multiline = true;
            }
        }

        if(multiline) str = newLine + str;

        return str;
    }

    static match(tokens: Token[], i: number): boolean {
        return false;
    }

    static initialize<T extends SyntacticElement>(tokens: Token[], startIndex: number, constructor: new () => T): [T, number] {
        return [
            create(new constructor(), obj => {
                obj.startIndex = startIndex;
                obj.tokenSource = tokens;
            }),
            startIndex
        ]
    }

    static fromTokens(tokens: Token[], startIndex: number): SyntacticElement {
        return create(this.caller.prototype, obj => {
            obj.tokenSource = tokens;
            obj.startIndex = startIndex;
        })
    }

    static fromPossibleElements<T extends (typeof SyntacticElement)[]>(tokens: Token[], startIndex: number, possibleElements: T): InstanceType<T[number]> | null {
        for(let possibleElement of possibleElements) {
            if(possibleElement.match(tokens, startIndex)) {
                return possibleElement.fromTokens(tokens, startIndex) as InstanceType<T[number]>;
            }
        }

        return null;
    }
}