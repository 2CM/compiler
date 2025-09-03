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
        let stringSource = tokens[0].stringSource;
        let start = tokens[this.startIndex].stringStartIndex;
        let end = tokens[this.endIndex - 1].stringEndIndex;

        let newLine = "\n" + linePrefix + indentationString + getAnsiColorCode(syntaxColors.string)

        return stringSource.slice(start, end).replaceAll("\n", newLine);

        // let indentationOffset = 0;

        // let str = ""

        // for(let i = 0; true; i++) {
        //     if(stringSource[start - i] == "\n") {
        //         indentationOffset = i - 1;

        //         break;
        //     }
        // }
        
        // let lines = stringSource.slice(start, end).split("\n");

        // console.log(lines)
        // console.log(indentationOffset)

        // str += "\n"
        // str += lines[0];
        // str += "\n"

        // for(let i = 1; i < lines.length; i++) {
        //     let line = lines[i];
        //     let lineStart = 0;

        //     for(let j = 0; j < line.length; j += 4) {
        //         if(line[j] != "\s") {
        //             lineStart = j;

        //             break;
        //         }
        //     }

        //     str += `${"  ".repeat(lineStart/4 - indentationOffset/4)}${line.slice(lineStart)}\n`
        // }

        // return str;

        // return newLine + tokens[0].stringSource
        //     .slice(tokens[this.startIndex].stringStartIndex, tokens[this.endIndex - 1].stringEndIndex)
        //     .replaceAll("\n", newLine)
        //     .replaceAll("    ", "  ")

        // let str = "";
        // let multiline = false;
        // let indent = 0;
        // let canDoMultiline = this.endIndex - this.startIndex > 5;

        // for(let i = this.startIndex; i < this.endIndex; i++) {
        //     str += tokens[i].value;

        //     if(i == this.endIndex - 1) continue;
        //     if(tokens[i + 1]?.value.match(/[,.;:()[\]]/)) continue;
        //     if(tokens[i]?.value.match(/[([.!]/)) continue;

        //     str += " "

        //     if(!canDoMultiline) continue;

        //     if(["{", ";", ":", "}"].includes(tokens[i]?.value) && !["else"].includes(tokens[i + 1]?.value)) {
        //         str += newLine;

        //         if(["{"].includes(tokens[i].value)) {
        //             indent++;
        //         }
                
        //         if("}".includes(tokens[i + 1]?.value)) {
        //             indent--;

        //             if(tokens[i].value == "{") {
        //                 str += newLine;
        //             }
        //         } else if(!["{", ":"].includes(tokens[i].value)) {
        //             str += newLine;
        //         }

        //         str += "  ".repeat(indent)

        //         multiline = true;
        //     }
        // }

        // if(multiline) str = newLine + str;

        // return str;
    }

    static match(tokens: Token[], i: number): boolean {
        return false;
    }

    static matchOrThrow(tokens: Token[], i: number) {
        if(!this.match(tokens, i)) throw new Error(`expected ${this.constructor.name}`);
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