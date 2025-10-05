import { create } from "../Utils/Utils";
import { BinaryExpression } from "./Expressions/BinaryExpression";
import { Expression } from "./Expressions/Expression";
import { ParenthesizedExpression } from "./Expressions/ParenthesizedExpression";
import { SyntacticElement } from "./SyntacticElement";
import { Operation } from "./TokenContainers/Operator";

export class ArgumentList extends SyntacticElement {
    arguments: Expression[] = [];

    static fromExpression(expression: Expression) {
        let argumentList = new ArgumentList();

        argumentList.applyMetadata(expression, expression);

        while(expression instanceof ParenthesizedExpression) {
            expression = expression.expression;
        }

        if(expression instanceof BinaryExpression) {
            let current: Expression = expression as BinaryExpression;

            while(current instanceof BinaryExpression && current.operator.value == Operation.Join) {
                argumentList.arguments.push(current.right);

                current = current.left;
            }

            argumentList.arguments.push(current);
            argumentList.arguments.reverse(); //nobody is going to have a 10k argument long argument list; its probably fine 😭
        } else {
            argumentList.arguments.push(expression);
        }

        return argumentList;
    }
}