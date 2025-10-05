import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { SyntacticElement } from "../SyntacticElement";
import { Expression } from "./Expression";

export class ConditionalExpression extends SyntacticElement implements Expression {
    condition: Expression;
    trueCondition: Expression;
    falseCondition: Expression;

    typeReference: TypeReference;

    determineTypeReference(scope: Scope) {
        
    }
}