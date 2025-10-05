import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { SyntacticElement } from "../SyntacticElement";
import { Operation, Operator } from "../TokenContainers/Operator";
import { Expression } from "./Expression";

export class BinaryExpression extends SyntacticElement implements Expression {
    left: Expression;
    operator: Operator;
    right: Expression;

    typeReference: TypeReference;

    determineTypeReference(scope: Scope) {
        
    }
}