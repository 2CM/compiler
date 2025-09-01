export enum Operation {
    Access,
    Call,
    Index,
    New,
    PostfixIncrement,
    PostfixDecrement,
    PrefixIncrement,
    PrefixDecrement,
    LogicalNot,
    BitwiseNot,
    UnaryPlus,
    UnaryMinus,
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
    Equals,
    NotEquals,
    BitwiseAnd,
    BitwiseXor,
    BitwiseOr,
    LogicalAnd,
    LogicalXor,
    LogicalOr,
    NullishCoalesce,
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

export namespace Operation {
    export const buh = 5;
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
    export const operationLevels: Operation[][] = [
        [
            Operation.Access,
            Operation.Call,
            Operation.Index
        ],
        [
            Operation.New
        ],
        [
            Operation.PostfixIncrement,
            Operation.PostfixDecrement
        ],
        [
            Operation.PrefixIncrement,
            Operation.PrefixDecrement,
            Operation.LogicalNot,
            Operation.BitwiseNot,
            Operation.UnaryPlus,
            Operation.UnaryMinus
        ],
        [
            Operation.Exponentiate,
        ],
        [
            Operation.Multiply,
            Operation.Divide,
            Operation.Remainder
        ],
        [
            Operation.Add,
            Operation.Subtract
        ],
        [
            Operation.ShiftLeft,
            Operation.ShiftRight
        ],
        [
            Operation.LessThan,
            Operation.LessThanOrEqual,
            Operation.GreaterThan,
            Operation.GreaterThanOrEqual,
        ],
        [
            Operation.Equals,
            Operation.NotEquals,
        ],
        [
            Operation.BitwiseAnd
        ],
        [
            Operation.BitwiseXor
        ],
        [
            Operation.BitwiseOr
        ],
        [
            Operation.LogicalAnd
        ],
        [
            Operation.LogicalXor
        ],
        [
            Operation.LogicalOr,
            Operation.NullishCoalesce
        ],
        [
            Operation.Assign,
            Operation.AssignExponentiate,
            Operation.AssignMultiply,
            Operation.AssignDivide,
            Operation.AssignRemainder,
            Operation.AssignAdd,
            Operation.AssignSubtract,
            Operation.AssignLeftShift,
            Operation.AssignRightShift,
            Operation.AssignBitwiseAnd,
            Operation.AssignBitwiseXor,
            Operation.AssignBitwiseOr,
            Operation.AssignLogicalAnd,
            Operation.AssignLogicalXor,
            Operation.AssignLogicalOr,
            Operation.AssignNullishCoalesce,
        ],
        [
            Operation.Join
        ],
    ]
    
    export const operatorStrToOperation = {
        ".": Operation.Access,
        // "": Operation.Call,
        // "": Operation.Index,
        "new": Operation.New,
        // "": Operation.PostfixIncrement,
        // "": Operation.PostfixDecrement,
        // "": Operation.PrefixIncrement,
        // "": Operation.PrefixDecrement,
        "!": Operation.LogicalNot,
        "~": Operation.BitwiseNot,
        // "": Operation.UnaryPlus,
        // "": Operation.UnaryMinus,
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
        "==": Operation.Equals,
        "!=": Operation.NotEquals,
        "&": Operation.BitwiseAnd,
        "^": Operation.BitwiseXor,
        "|": Operation.BitwiseOr,
        "&&": Operation.LogicalAnd,
        "^^": Operation.LogicalXor,
        "||": Operation.LogicalOr,
        "??": Operation.NullishCoalesce,
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
    } as const;
    
    export function convertOperatorToOperation(char: string) {
        return operatorStrToOperation[char as keyof typeof operatorStrToOperation] as Operation;
    }
}
