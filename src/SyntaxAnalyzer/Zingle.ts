import type { Expression } from "./Expression";
import type { ExpressionList } from "./ExpressionList";
import type { Identifier } from "./TokenContainers/Identifier";
import type { Literal } from "./TokenContainers/Literal";

export type Zingle = Identifier | Literal | Expression | ExpressionList;

export function isZingle(obj: any): obj is Zingle {
    return ["Identifier", "Literal", "Expression", "ExpressionList"].includes(obj?.constructor.name);
}