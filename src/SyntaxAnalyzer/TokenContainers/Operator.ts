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

export enum OperationUse {
    Binary,
    Prefix,
    Postfix,
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

    static operationGroups: Partial<Record<Operation, OperationUse>>[] = [
        {
            [Operation.Access]: OperationUse.Binary,
            [Operation.Optional]: OperationUse.Postfix,
            [Operation.Invoke]: OperationUse.Binary,
            [Operation.Index]: OperationUse.Binary,
            [Operation.PostfixIncrement]: OperationUse.Postfix,
            [Operation.PostfixDecrement]: OperationUse.Postfix,
            [Operation.New]: OperationUse.Prefix,
            [Operation.Typeof]: OperationUse.Prefix,
            [Operation.Default]: OperationUse.Prefix,
        },
        {
            [Operation.PrefixIncrement]: OperationUse.Prefix,
            [Operation.PrefixDecrement]: OperationUse.Prefix,
            [Operation.LogicalNot]: OperationUse.Prefix,
            [Operation.BitwiseNot]: OperationUse.Prefix,
            [Operation.UnaryPlus]: OperationUse.Prefix,
            [Operation.UnaryMinus]: OperationUse.Prefix,
            [Operation.Cast]: OperationUse.Prefix,
        },
        {
            [Operation.Exponentiate]: OperationUse.Binary,
            [Operation.Multiply]: OperationUse.Binary,
            [Operation.Divide]: OperationUse.Binary,
            [Operation.Remainder]: OperationUse.Binary,
        },
        {
            [Operation.Add]: OperationUse.Binary,
            [Operation.Subtract]: OperationUse.Binary,
        },
        {
            [Operation.ShiftLeft]: OperationUse.Binary,
            [Operation.ShiftRight]: OperationUse.Binary,
        },
        {
            [Operation.LessThan]: OperationUse.Binary,
            [Operation.LessThanOrEqual]: OperationUse.Binary,
            [Operation.GreaterThan]: OperationUse.Binary,
            [Operation.GreaterThanOrEqual]: OperationUse.Binary,
            [Operation.Is]: OperationUse.Binary,
            [Operation.As]: OperationUse.Binary,
        },
        {
            [Operation.Equals]: OperationUse.Binary,
            [Operation.NotEquals]: OperationUse.Binary,
        },
        {
            [Operation.BitwiseAnd]: OperationUse.Binary,
            [Operation.BitwiseXor]: OperationUse.Binary,
            [Operation.BitwiseOr]: OperationUse.Binary,
        },
        {
            [Operation.LogicalAnd]: OperationUse.Binary,
            [Operation.LogicalXor]: OperationUse.Binary,
            [Operation.LogicalOr]: OperationUse.Binary,
        },
        {
            [Operation.NullishCoalesce]: OperationUse.Binary,
            [Operation.Throw]: OperationUse.Prefix,
        },
        {
            [Operation.Conditional]: OperationUse.Binary,
        },
        {
            [Operation.Assign]: OperationUse.Binary,
            [Operation.AssignExponentiate]: OperationUse.Binary,
            [Operation.AssignMultiply]: OperationUse.Binary,
            [Operation.AssignDivide]: OperationUse.Binary,
            [Operation.AssignRemainder]: OperationUse.Binary,
            [Operation.AssignAdd]: OperationUse.Binary,
            [Operation.AssignSubtract]: OperationUse.Binary,
            [Operation.AssignLeftShift]: OperationUse.Binary,
            [Operation.AssignRightShift]: OperationUse.Binary,
            [Operation.AssignBitwiseAnd]: OperationUse.Binary,
            [Operation.AssignBitwiseXor]: OperationUse.Binary,
            [Operation.AssignBitwiseOr]: OperationUse.Binary,
            [Operation.AssignLogicalAnd]: OperationUse.Binary,
            [Operation.AssignLogicalXor]: OperationUse.Binary,
            [Operation.AssignLogicalOr]: OperationUse.Binary,
            [Operation.AssignNullishCoalesce]: OperationUse.Binary,
        },
        // {
        //     [Operation.Join]: OperationUse.Binary,
        // }
    ]

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

