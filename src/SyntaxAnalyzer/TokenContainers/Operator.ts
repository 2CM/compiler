import { IEmitsIl, IlEmitter } from "../../IntermediateCodeGenerator/IlEmitter";
import { Token, TokenType } from "../../Tokenizer/Token";
import { color, colorWithType, create, enumValue, syntaxColors } from "../../Utils/Utils";
import { TokenContainer } from "./TokenContainer";

//https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/expressions#1242-operator-precedence-and-associativity
export enum Operation {
    Access,
    Optional,
    Invoke,
    Index,
    PostfixIncrement,
    PostfixDecrement,
    New,
    Typeof,
    Default,
    
    PrefixIncrement,
    PrefixDecrement,
    LogicalNot,
    BitwiseNot,
    UnaryPlus,
    UnaryMinus,
    Cast,
    
    Exponentiate,
    Multiply,
    Divide,
    Remainder,

    Add,
    Subtract,
    
    ShiftLeft,
    ShiftRight,
    
    LessThan,
    LessThanOrEqual,
    GreaterThan,
    GreaterThanOrEqual,
    Is,
    As,

    Equals,
    NotEquals,
    
    BitwiseAnd,
    BitwiseXor,
    BitwiseOr,
    
    LogicalAnd,
    LogicalXor,
    LogicalOr,

    NullishCoalesce,
    Throw,

    Conditional,

    Assign,
    AssignExponentiate,
    AssignMultiply,
    AssignDivide,
    AssignRemainder,
    AssignAdd,
    AssignSubtract,
    AssignLeftShift,
    AssignRightShift,
    AssignBitwiseAnd,
    AssignBitwiseXor,
    AssignBitwiseOr,
    AssignLogicalAnd,
    AssignLogicalXor,
    AssignLogicalOr,
    AssignNullishCoalesce,

    Join,
}

export class Operator extends TokenContainer<Operation> implements IEmitsIl {
    static tokenType = TokenType.Operator;

    @enumValue(Operator, Operation)
    declare value: Operation;

    static transformValue(value: string) {
        return Operator.convertOperatorToOperation(value);
    }

    inlineToString() {
        return `(${color(Operation[this.value], syntaxColors.name)}, ${colorWithType(`"${this.tokenSection()}"`)})`;
    }

    emitIl(emitter: IlEmitter) {
        
    }

    static operatorStrToOperation = {
        ".": Operation.Access,
        "?": Operation.Optional,
        // "": Operation.Invoke,
        // "": Operation.Index,
        "++": Operation.PostfixIncrement,
        "--": Operation.PostfixDecrement,
        "new": Operation.New,
        "typeof": Operation.Typeof,
        "default": Operation.Default,
        
        // "": Operation.PrefixIncrement,
        // "": Operation.PrefixDecrement,
        "!": Operation.LogicalNot,
        "~": Operation.BitwiseNot,
        // "+": Operation.UnaryPlus,
        // "-": Operation.UnaryMinus,
        // "": Operation.Cast,
        
        "**": Operation.Exponentiate,
        "*": Operation.Multiply,
        "/": Operation.Divide,
        "%": Operation.Remainder,

        "+": Operation.Add,
        "-": Operation.Subtract,
        
        "<<": Operation.ShiftLeft,
        ">>": Operation.ShiftRight,
        
        "<": Operation.LessThan,
        "<=": Operation.LessThanOrEqual,
        ">": Operation.GreaterThan,
        ">=": Operation.GreaterThanOrEqual,
        "is": Operation.Is,
        "as": Operation.As,

        "==": Operation.Equals,
        "!=": Operation.NotEquals,
        
        "&": Operation.BitwiseAnd,
        "^": Operation.BitwiseXor,
        "|": Operation.BitwiseOr,
        
        "&&": Operation.LogicalAnd,
        "^^": Operation.LogicalXor,
        "||": Operation.LogicalOr,

        "??": Operation.NullishCoalesce,
        "throw": Operation.Throw,

        // "": Operation.Conditional,

        "=": Operation.Assign,
        "**=": Operation.AssignExponentiate,
        "*=": Operation.AssignMultiply,
        "/=": Operation.AssignDivide,
        "%=": Operation.AssignRemainder,
        "+=": Operation.AssignAdd,
        "-=": Operation.AssignSubtract,
        "<<=": Operation.AssignLeftShift,
        ">>=": Operation.AssignRightShift,
        "&=": Operation.AssignBitwiseAnd,
        "^=": Operation.AssignBitwiseXor,
        "|=": Operation.AssignBitwiseOr,
        "&&=": Operation.AssignLogicalAnd,
        "^^=": Operation.AssignLogicalXor,
        "||=": Operation.AssignLogicalOr,
        "??=": Operation.AssignNullishCoalesce,
        
        ",": Operation.Join,

        // ".": Operation.Access,
        // // "": Operation.Call,
        // // "": Operation.Index,
        // // "": Operation.Generic,
        // // "": Operation.Declare,
        // "new": Operation.New,
        // // "": Operation.PostfixIncrement,
        // // "": Operation.PostfixDecrement,
        // // "": Operation.PrefixIncrement,
        // // "": Operation.PrefixDecrement,
        // "!": Operation.LogicalNot,
        // "~": Operation.BitwiseNot,
        // // "": Operation.UnaryPlus,
        // // "": Operation.UnaryMinus,
        // "**": Operation.Exponentiate,
        // "*": Operation.Multiply,
        // "/": Operation.Divide,
        // "%": Operation.Remainder,
        // "+": Operation.Add,
        // "-": Operation.Subtract,
        // // "<<": Operation.ShiftLeft,
        // // ">>": Operation.ShiftRight,
        // "<": Operation.LessThan,
        // "<=": Operation.LessThanOrEqual,
        // ">": Operation.GreaterThan,
        // ">=": Operation.GreaterThanOrEqual,
        // "==": Operation.Equals,
        // "!=": Operation.NotEquals,
        // "&": Operation.BitwiseAnd,
        // "^": Operation.BitwiseXor,
        // "|": Operation.BitwiseOr,
        // "&&": Operation.LogicalAnd,
        // "^^": Operation.LogicalXor,
        // "||": Operation.LogicalOr,
        // "??": Operation.NullishCoalesce,
        // "=": Operation.Assign,
        // "**=": Operation.AssignExponentiate,
        // "*=": Operation.AssignMultiply,
        // "/=": Operation.AssignDivide,
        // "%=": Operation.AssignRemainder,
        // "+=": Operation.AssignAdd,
        // "-=": Operation.AssignSubtract,
        // "<<=": Operation.AssignLeftShift,
        // ">>=": Operation.AssignRightShift,
        // "&=": Operation.AssignBitwiseAnd,
        // "^=": Operation.AssignBitwiseXor,
        // "|=": Operation.AssignBitwiseOr,
        // "&&=": Operation.AssignLogicalAnd,
        // "^^=": Operation.AssignLogicalXor,
        // "||=": Operation.AssignLogicalOr,
        // "??=": Operation.AssignNullishCoalesce,
        // ",": Operation.Join,
    } as const;

    static convertOperatorToOperation(char: string) {
        return this.operatorStrToOperation[char as keyof typeof this.operatorStrToOperation] as Operation;
    }
}

