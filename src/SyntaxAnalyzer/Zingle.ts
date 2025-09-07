import type { Expression } from "./Expression";
import type { ExpressionList } from "./ExpressionList";
import { Generic } from "./Generic";
import type { Identifier } from "./TokenContainers/Identifier";
import type { Literal } from "./TokenContainers/Literal";

export type Zingle = Identifier | Literal | Expression | ExpressionList | Generic;

export namespace Zingle {
    export function isZingle(obj: any): obj is Zingle {
        return ["Identifier", "Literal", "Expression", "Generic", "ExpressionList"].includes(obj?.constructor.name);
    }
}