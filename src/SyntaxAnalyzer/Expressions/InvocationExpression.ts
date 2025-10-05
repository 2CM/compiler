import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { ArgumentList } from "../ArgumentList";
import { SyntacticElement } from "../SyntacticElement";
import { Expression } from "./Expression";

export class InvocationExpression extends SyntacticElement implements Expression {
    target: Expression;
    arguments: ArgumentList;
    
    typeReference: TypeReference;

    determineTypeReference(scope: Scope) {
        
    }
}