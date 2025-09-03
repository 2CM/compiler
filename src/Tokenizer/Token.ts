import { Operation } from "../SyntaxAnalyzer/Operation";
import { Keyword } from "../SyntaxAnalyzer/TokenContainers/Keyword";
import { cleanStringForRegex, color, create, enumValue, ignoreInLogging, syntaxColors, yourtakingtoolong } from "../Utils/Utils";

export enum TokenType {
    Identifier,
    Literal,
    Separator,
    Keyword,
    Operator,
}

export class Token {
    @enumValue(Token, TokenType)
    type: TokenType;
    value: string;
    
    @ignoreInLogging()
    index: number;
    
    @ignoreInLogging()
    tokenSource: Token[];
    
    @ignoreInLogging()
    stringStartIndex: number;
    
    @ignoreInLogging()
    stringEndIndex: number;
    
    @ignoreInLogging()
    stringSource: string;

    checkTypeOrThrow(type: TokenType) {
        if(this.type == type) return true;

        throw new Error(`expected ${TokenType[type]}`);
    }

    checkValueOrThrow(...values: string[]) {
        for(let value of values) {
            if(this.value == value) return true;
        }

        throw new Error(`expected ${values.join(",")}`);
    }

    inlineToString() {
        return `(${color(TokenType[this.type], syntaxColors.type)}, ${color(this.value, syntaxColors.value)})`;
    }

    static stringToTokens(str: string): Token[] {
        let tokens: Token[] = [];
        let index = 0;
        let operatorMatch = Object.keys(Operation.operatorStrToOperation)
            .sort((a,b) => a.length > b.length ? -1 : 1)
            .map(cleanStringForRegex)
            .join("|");

        let keywordMatch = Keyword.keywords.join("|");

        let regex = new RegExp(
            [
                `(?<keyword>${keywordMatch})`,
                /(?<literal>(-?\d+(\.\d+)?|("[^"]+")|true|false))/,
                /(?<identifier>[A-Z|a-z]([A-Z|a-z|0-9]+)?)/,
                `(?<operator>${operatorMatch})`,
                /(?<separator>[()[\]{};:\<\>])/,
                /(?<whitespace>[\n\s]+)/,
            ].map(regex => regex instanceof RegExp ? regex.source : regex).join("|"),
            "y"
        );

        while(index < str.length) {
            yourtakingtoolong()

            let match = str.match(regex);

            if(match) {
                //what is this doing
                index += match[0].length;
                
                if(match.groups?.whitespace) {
                    continue;
                }
                
                let type =
                    match.groups?.keyword ? TokenType.Keyword : 
                    match.groups?.literal ? TokenType.Literal : 
                    match.groups?.identifier ? TokenType.Identifier : 
                    match.groups?.operator ? TokenType.Operator: 
                    match.groups?.separator ? TokenType.Separator : null;
                
                if(type === null) {
                    throw new Error("unexpected token " + match[0])
                }
                
                tokens.push(create(new Token(), obj => {
                    obj.type = type
                    obj.value = match[0]
                    obj.index = tokens.length
                    obj.stringSource = str
                    obj.stringStartIndex = index - match[0].length
                    obj.stringEndIndex = index
                }));
            } else {
                throw new Error("no match")
            }
        }


        return tokens;
    }
}