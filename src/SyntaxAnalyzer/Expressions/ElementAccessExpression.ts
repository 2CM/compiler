import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { ArgumentList } from "../ArgumentList";
import { SyntacticElement } from "../SyntacticElement";
import { Expression } from "./Expression";

export class ElementAccessExpression extends SyntacticElement implements Expression {
    left: Expression;
    right: Expression;

    typeReference: TypeReference;

    determineTypeReference(scope: Scope) {
        
    }
}