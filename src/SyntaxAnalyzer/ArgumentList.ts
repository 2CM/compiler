import { Expression } from "./Expressions/Expression";
import { SyntacticElement } from "./SyntacticElement";

export class ArgumentList extends SyntacticElement {
    arguments: Expression[];
}