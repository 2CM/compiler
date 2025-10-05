import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { Token } from "../../Tokenizer/Token";
import { ElementBuilder } from "../ElementBuilder";
import { SyntacticElement } from "../SyntacticElement";
import { Separator } from "../TokenContainers/Separator";
import { Expression } from "./Expression";

function getCloseParentheses(openParentheses: string) {
    return (
        openParentheses == "(" ? ")" :
        openParentheses == "[" ? "]" :
        "???"
    )
}

export class ParenthesizedExpression extends SyntacticElement implements Expression {
    openParentheses: Separator;
    closeParentheses: Separator;
    expression: Expression;
    
    typeReference: TypeReference;

    static read(self: ParenthesizedExpression, builder: ElementBuilder) {
        builder.matchExpectedValue("(", "[");
        self.openParentheses = builder.readElement(Separator);
        
        self.expression = builder.readElement(Expression);
        
        builder.matchExpectedValue(getCloseParentheses(self.openParentheses.value));
        self.closeParentheses = builder.readElement(Separator);

        return builder.finish();
    }

    determineTypeReference(scope: Scope) {
        
    }
}