import { Token, TokenType } from "../Tokenizer/Token";
import { yourtakingtoolong, create } from "../Utils/Utils";
import { ExpressionList } from "./ExpressionList";
import { Identifier } from "./TokenContainers/Identifier";
import { Literal } from "./TokenContainers/Literal";
import { Operation } from "./Operation";
import { Operator } from "./TokenContainers/Operator";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";
import { ElementBuilder } from "./ElementBuilder";

export class Expression extends SyntacticElement {
    left: Zingle;
    right?: Zingle;
    // @enumValue(Expression, Operation)
    operation: Operator;

    static fromComponents(components: (Zingle | Operator)[]): Zingle {
        console.log({components})

        for(let i = 0; i < Operation.operationLevels.length; i++) {
            let operationLevel = Operation.operationLevels[i];
            let j = 0;

            while(j < components.length - 1) {
                yourtakingtoolong();

                let left: Zingle = components[j] as Zingle;
                let operator: Operator = components[j + 1] as Operator;
                let right: Zingle | null = components[j + 2] as Zingle;

                let tokensToSplice = 2;

                if(components[j] instanceof Operator) { //!zingle
                    left = components[j + 1] as Zingle;
                    operator = components[j] as Operator;
                    right = null;

                    tokensToSplice = 1;
                } else if(Zingle.isZingle(components[j + 1])) { //zingle(zingle)
                    right = components[j + 1] as Zingle;

                    let operation: Operation = Operation.Call;

                    switch(right.tokenSource[right.endIndex - 1].value) {
                        case "]": operation = Operation.Index; break;
                        case ")": operation = Operation.Call; break;
                        default: throw new Error("what are you");
                    }

                    operator = create(new Operator(), obj => {
                        if(!right) return;

                        obj.tokenSource = left.tokenSource
                        obj.startIndex = right.startIndex
                        obj.endIndex = right.startIndex + 1
                        obj.value = operation
                    })

                    tokensToSplice = 1;
                }

                if(!operationLevel.includes(operator.value)) {
                    j++;

                    continue;
                }

                if(operationLevel.includes(Operation.Join)) {
                    if(!right) throw new Error("whwheih you need a right siode")

                    if(!(left instanceof ExpressionList)) {
                        left = new ExpressionList([left]);

                        components[j] = left;
                    }

                    left.list.push(right)
                    left.endIndex = right.endIndex;
                } else {
                    let expression = create(new Expression(), obj => {
                        obj.operation = operator
                        obj.left = left

                        obj.tokenSource = left.tokenSource
                        obj.startIndex = left.startIndex
                        obj.endIndex = left.endIndex

                        if(right) {
                            obj.endIndex = right.endIndex
                            obj.right = right
                        }
                    });

                    components[j] = expression;
                }

                components.splice(j + 1, tokensToSplice);
            }
        }
    
        return components[0] as Zingle ?? new ExpressionList([]);
    }

    static read(self: Expression, builder: ElementBuilder) {
        let components: (Zingle | Operator)[] = [];

        while(builder.going) {
            yourtakingtoolong();

            switch(builder.current.type) { 
                case TokenType.Identifier:
                    components.push(builder.readElement(Identifier));

                    break;
                case TokenType.Literal:
                    components.push(builder.readElement(Literal));
                    
                    break;
                case TokenType.Operator:
                    components.push(builder.readElement(Operator));
                    
                    break;
                case TokenType.Separator:
                    if(builder.advancePastValue("(", "[")) {
                        let subExpression = builder.readElement(Expression);

                        while(true) {
                            yourtakingtoolong();

                            let back = subExpression.tokenSource[subExpression.startIndex - 1]?.value;
                            let front = subExpression.tokenSource[subExpression.endIndex]?.value;

                            if(
                                (back == "(" && front == ")") ||
                                (back == "[" && front == "]")
                            ) {
                                subExpression.startIndex--;
                                subExpression.endIndex++;
                                builder.advance();
                            } else {
                                break;
                            }
                        }

                        components.push(subExpression);
                        // i = subExpression.endIndex;
                    } else if(builder.checkValue(")", "]", ";", ":")) {
                        return create(Expression.fromComponents(components), obj => {
                            obj.tokenSource = builder.tokens
                            obj.startIndex = builder.element.startIndex
                            obj.endIndex = builder.i
                        })
                    }
            }
        }

        throw new Error("what");
    }
}