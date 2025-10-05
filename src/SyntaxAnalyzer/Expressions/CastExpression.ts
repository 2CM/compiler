import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { SyntacticElement } from "../SyntacticElement";
import { Expression } from "./Expression";
import { ParenthesizedExpression } from "./ParenthesizedExpression";

export class CastExpression extends SyntacticElement implements Expression {
    left: ParenthesizedExpression;
    right: Expression;

    typeReference: TypeReference;

    determineTypeReference(scope: Scope): void {
        
    }
}