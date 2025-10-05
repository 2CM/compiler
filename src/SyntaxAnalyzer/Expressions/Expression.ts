import { IHasType } from "../../SemanticAnalyzer/IHasType";
import { Scope } from "../../SemanticAnalyzer/Scope";
import { TypeReference } from "../../SemanticAnalyzer/TypeReference";
import { create, yourtakingtoolong } from "../../Utils/Utils";
import { ArgumentList } from "../ArgumentList";
import { ElementBuilder } from "../ElementBuilder";
import { SyntacticElement } from "../SyntacticElement";
import { Identifier } from "../TokenContainers/Identifier";
import { Keyword } from "../TokenContainers/Keyword";
import { Literal } from "../TokenContainers/Literal";
import { Operation, OperationUse, Operator } from "../TokenContainers/Operator";
import { Separator } from "../TokenContainers/Separator";
import { BinaryExpression } from "./BinaryExpression";
import { CastExpression } from "./CastExpression";
import { ConditionalExpression } from "./ConditionalExpression";
import { ElementAccessExpression } from "./ElementAccessExpression";
import { InvocationExpression } from "./InvocationExpression";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { UnaryExpression } from "./UnaryExpression";

type Component = Expression | Operator | Separator;

export class Expression extends SyntacticElement implements IHasType {
    typeReference: TypeReference;

    static tryResolveUnaryExpression(components: (Component)[], i: number): {expression: Expression, size: number} {
        let left = components[i];
        let expression: Expression = components[i] as Expression;
        let size = 1;

        if(left instanceof Operator) {
            let resolved = this.tryResolveUnaryExpression(components, i + 1);

            size = resolved.size + 1;
            expression = create(new UnaryExpression(), obj => {
                obj.operator = left
                obj.operand = resolved.expression
            });
        } else if(left instanceof ParenthesizedExpression && left.expression instanceof Identifier) { //cast
            let resolved = this.tryResolveUnaryExpression(components, i + 1);

            size = resolved.size + 1;
            expression = create(new CastExpression(), obj => {
                obj.left = left
                obj.right = resolved.expression
            });
        }

        return { expression, size };
    }

    static processComponents(components: (Component)[]) {
        console.log(components);

        function matchUnaryStart(i: number) {
            return (
                components[i] instanceof Operator ||
                (
                    components[i + 1] instanceof ParenthesizedExpression &&
                    (components[i + 1] as ParenthesizedExpression).expression instanceof Identifier &&
                    !(components[i + 1] instanceof Operator)
                )
            )
        }

        function matchConditionalStart(i: number) {
            return (
                components[i + 1] instanceof Operator && (components[i + 1] as Operator).value == Operation.Optional &&
                components[i + 3] instanceof Separator && (components[i + 3] as Separator).value == ":"
            )
        }

        for(let group of Operator.operationGroups) {
            for(let i = 0; i < components.length; i++) {
                let left = components[i];
                let middle = components[i + 1];
                let right = components[i + 2];
                let furtherRight = components[i + 3];
                let evenFurtherRight = components[i + 4];

                // console.log("b", left, middle)

                if(left instanceof Separator || middle instanceof Separator || right instanceof Separator) continue;

                if(!middle) break;
                
                //prefix unary expressions
                if(matchUnaryStart(i)) {
                    let operation = left instanceof Operator ? left.value : Operation.Cast;

                    if(group[operation] == OperationUse.Prefix) {
                        if(middle instanceof Operator || matchUnaryStart(i + 1)) continue;

                        let expression: Expression | null = null;

                        if(left instanceof Operator) {
                            expression = create(new UnaryExpression(), obj => {
                                obj.operator = left
                                obj.operand = middle
                                
                                obj.applyMetadata(left, middle)
                            })
                        } else if(left instanceof ParenthesizedExpression) {
                            expression = create(new CastExpression(), obj => {
                                obj.left = left
                                obj.right = middle

                                obj.applyMetadata(left, middle)
                            })
                        }

                        if(!expression) throw new Error("p");

                        components.splice(i, 2, expression);

                        i--;
                        if(matchUnaryStart(i)) i--;
                        continue;
                    }
                }
                
                if(left instanceof Operator || matchUnaryStart(i)) continue; 
                if(middle instanceof Operator && group[middle.value] == null) continue;

                //conditional expressions
                if(matchConditionalStart(i) && group[Operation.Conditional] !== null) {
                    if(matchConditionalStart(i + 4)) {
                        i += 3;
                        
                        continue;
                    }

                    if(
                        !(left instanceof Operator) &&
                        !(right instanceof Operator) &&
                        !(evenFurtherRight instanceof Operator || evenFurtherRight instanceof Separator)
                    ) {
                        let conditionalExpression = create(new ConditionalExpression(), obj => {
                            obj.condition = left
                            obj.trueCondition = right
                            obj.falseCondition = evenFurtherRight

                            obj.applyMetadata(left, evenFurtherRight)
                        })

                        components.splice(i, 5, conditionalExpression);
                        i--;

                        if(matchConditionalStart(i - 4)) {
                            i -= 4;
                        }

                        continue;
                    }
                }
                
                //postfix unary expressions
                if(middle instanceof Operator && group[middle.value] == OperationUse.Postfix) {
                    let postfixUnaryExpression = create(new UnaryExpression(), obj => {
                        obj.operator = middle
                        obj.operand = left

                        obj.applyMetadata(left, middle)
                    })

                    components.splice(i, 2, postfixUnaryExpression);
                    
                    i--;
                    continue;
                }
                
                //regular binary expressions (x + y)
                if(middle instanceof Operator && group[middle.value] == OperationUse.Binary) {
                    if(right instanceof Operator) throw new Error("evil");

                    let binaryExpression = create(new BinaryExpression(), obj => {
                        obj.operator = middle
                        obj.left = left
                        obj.right = right

                        obj.applyMetadata(left, right)
                    })

                    components.splice(i, 3, binaryExpression);
                    i--;
                } else { //irregular binary expresssions (thing(somethingelse))
                    if(middle instanceof ParenthesizedExpression) {                    
                        let expression: Expression | null = null;
                        
                        if(middle.openParentheses.value == "(" && group[Operation.Invoke] == OperationUse.Binary) {
                            expression = create(new InvocationExpression(), obj => {
                                obj.target = left
                                obj.arguments = ArgumentList.fromExpression(middle)

                                obj.applyMetadata(left, middle)
                            })
                        } else if(middle.openParentheses.value == "[" && group[Operation.Index] == OperationUse.Binary) {
                            expression = create(new ElementAccessExpression(), obj => {
                                obj.left = left
                                obj.right = middle

                                obj.applyMetadata(left, middle)
                            })
                        }

                        if(!expression) continue;

                        components.splice(i, 2, expression);
                        i--;
                    } else {
                        throw new Error("eijfef")
                    }
                }
            }
        }
        
        console.log(components);
        
        return components[0] as Expression;
    }

    static read(self: Expression, builder: ElementBuilder) {
        let components: (Component)[] = [];

        while(builder.going) {
            yourtakingtoolong();

            console.log(builder.current)

            if(builder.matchValue("(", "[")) {
                components.push(builder.readElement(ParenthesizedExpression));

                continue;
            }

            if(builder.matchValue(")", "]")) break;
                        
            let element = builder.readElementFromPossibilities([
                Operator,
                Literal,
                Identifier,
                Separator,
                // Keyword,
            ]);


            if(!element) throw new Error("quog");

            if(element instanceof Operator && (components.length == 0 || components.at(-1) instanceof Operator)) {
                if(element.value == Operation.PostfixIncrement) element.value = Operation.PrefixIncrement;
                if(element.value == Operation.PostfixDecrement) element.value = Operation.PrefixDecrement;
                if(element.value == Operation.Add) element.value = Operation.UnaryPlus;
                if(element.value == Operation.Subtract) element.value = Operation.UnaryMinus;
            }

            components.push(element);
        }

        builder.finish();

        return create(this.processComponents(components), obj => {
            obj.applyMetadata(self, self)
        });
    }

    determineTypeReference(scope: Scope) {
        
    }
}

/*
do it recursively

await +-+-(Int32)(Float32)(5 + 2) + 1

(Scene as Level).Buh();

!(Object)(x as Bingle)?[1]?.buh + 1;
*/

/*
import { Token, TokenType } from "../Tokenizer/Token";
import { yourtakingtoolong, create } from "../Utils/Utils";
import { ExpressionList } from "./ExpressionList";
import { Identifier } from "./TokenContainers/Identifier";
import { Literal } from "./TokenContainers/Literal";
import { Operation } from "./Operation";
import { Operator } from "./TokenContainers/Operator";
import { SyntacticElement } from "./SyntacticElement";
import { ElementBuilder } from "./ElementBuilder";
import { Generic } from "./Generic";
import { IEmitsIl, IlEmitter } from "../IntermediateCodeGenerator/IlEmitter";
import { TypeReference } from "../SemanticAnalyzer/TypeReference";
import { IHasType } from "../SemanticAnalyzer/IHasType";
import { Scope } from "../SemanticAnalyzer/Scope";
import { Keyword } from "./TokenContainers/Keyword";

export class Expression {

}

type Component = Zingle | Operator;

export class Expression extends SyntacticElement implements IEmitsIl, IHasType {
    left: Zingle;
    right?: Zingle;
    operation: Operator;

    typeReference: TypeReference;

    static fromComponents(components: Component[]): Zingle {
        console.log({components})

        for(let i = 0; i < Operation.operationLevels.length; i++) {
            let operationLevel = Operation.operationLevels[i];
            let j = 0;

            while(j < components.length - 1) {
                yourtakingtoolong();

                let left: Zingle = components[j];
                let operator: Operator = components[j + 1] as Operator;
                let right: Zingle | null = components[j + 2];

                let tokensToSplice = 2;

                if(components[j] instanceof Operator) { //!zingle
                    left = components[j + 1] as Zingle;
                    operator = components[j] as Operator;
                    right = null;

                    tokensToSplice = 1;
                } else if(Zingle.isZingle(components[j + 1])) { //zingle(zingle)
                    right = components[j + 1] as Zingle;

                    let operation: Operation;

                    switch(right.tokenSource[right.endIndex - 1].value) {
                        case "]": operation = Operation.Index; break;
                        case ")": operation = Operation.Call; break;
                        case ">": operation = Operation.Generic; break;
                        default:
                            if(right instanceof Identifier) {
                                operation = Operation.Declare;

                                break;
                            }

                            throw new Error("what are you");
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
        let components: Component[] = [];

        while(builder.going) {
            yourtakingtoolong();

            switch(builder.current.type) { 
                case TokenType.Keyword:
                    components.push(builder.readElement(Keyword));

                    break;
                case TokenType.Identifier:
                    components.push(builder.readElement(Identifier));

                    break;
                case TokenType.Literal:
                    components.push(builder.readElement(Literal));
                    
                    break;
                case TokenType.Operator:
                    if(builder.matchElement(Generic, false)) {
                        components.push(builder.readElement(Generic));

                        break;
                    }

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

    determineTypeReference(scope: Scope) {
        if(this.left instanceof Generic || this.left instanceof ExpressionList) return;

        console.log(this.left);

        this.left.determineTypeReference(scope);

        let leftType = this.left.typeReference;

        if(!leftType) throw new Error("couldnt determine type of the left")

        switch(this.operation.value) {
            case Operation.Access:
                if(this.right instanceof Identifier) {
                    let accessedMember = leftType.class.getMember(this.right?.value);

                    if(!accessedMember) throw new Error(`couldnt access member "${this.right?.value}"`);

                    this.typeReference = accessedMember.type;
                }

                break;
            case Operation.Call:
                if(this.right instanceof Generic) throw new Error("cant call a generic");

                this.right?.determineTypeReference(scope);

                this.typeReference = leftType;
            break;
            default:
                if(!(this.right instanceof Generic)) {
                    this.right?.determineTypeReference(scope);

                    if(!TypeReference.compare(this.left.typeReference, this.right?.typeReference))
                        throw new Error("left and right side dont match types");

                    this.typeReference = leftType;
                }
        }
    }

    emitIl(emitter: IlEmitter) {
        // if(this.left instanceof Generic) throw new Error("weird generic position 2 electric boogaloo left side");
        // if(this.right instanceof Generic) throw new Error("weird generic position 2 electric boogaloo right side");

        // switch(this.operation.value) {
        //     case Operation.Declare:
        //         this.right?.emitIl(emitter);
        //     case Operation.Access:
        //         //rightType = emitter.blahblahblah
                
        //     case Operation.Index:
        //     case Operation.Call:
        //     case Operation.Assign:
        // }

        // this.left.emitIl(emitter);
        // this.right?.emitIl(emitter);
        // this.operation.emitIl(emitter);
    }
}
*/

/*
bingle.zingle[0] = hello(Int32 buh = 5, bongle.b);

left
right
index
*/

/*
type Zingle = Expression | Identifier | Literal

ArgumentList
- arguments: Zingle[]

BinaryExpression : Expression
- left: Zingle
- right: Zingle
- operator: Operator

UnaryExpression : Expression
- value: Zingle
- operator: Operator

ObjectCreationExpression : Expression
- type?: Type
- arguments: ArgumentList

InvocationExpression : Expression
- left: Zingle
- arguments: ArgumentList

ConditionalExpression : Expression
- condition: Zingle
- trueCase: Zingle
- falseCase: Zingle

parseComponents(components: (Zingle | Operator)[]) {
    in order of operations {
        for i in components {
            [zingle], ?, [zingle], :, [zingle] {
                conditionalExpression = ...

                components.splice(i, 5, conditionalExpression)
            }

            [operator], * {
                unaryExpression = ...

                components.splice(i, 2, unaryExpression)
            }

            [zingle], [argumentlist] {
                
            }

            [zingle], [operator], [zingle] {
                binaryExpression = ...

                components.splice(i, 3, binaryExpression)
            }
        }
    }
}

*/