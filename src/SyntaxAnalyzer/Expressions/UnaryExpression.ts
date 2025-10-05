import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { SyntacticElement } from "../SyntacticElement";
import { Operator } from "../TokenContainers/Operator";
import { Expression } from "./Expression";

export class UnaryExpression extends SyntacticElement implements Expression {
    operator: Operator;
    operand: Expression;

    typeReference: TypeReference;

    determineTypeReference(scope: Scope) {
        
    }
}