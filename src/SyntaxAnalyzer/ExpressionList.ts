import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";

export class ExpressionList extends SyntacticElement {
    list: Zingle[];

    constructor(list: Zingle[]) {
        super();

        this.list = list;
    }
}