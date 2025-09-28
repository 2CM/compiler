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
import { Generic } from "./Generic";
import { IEmitsIl, IlEmitter } from "../IntermediateCodeGenerator/IlEmitter";
import { TypeReference } from "../SemanticAnalyzer/TypeReference";
import { IHasType } from "../SemanticAnalyzer/IHasType";
import { Scope } from "../SemanticAnalyzer/Scope";

type Component = Zingle | Operator;

export class Expression extends SyntacticElement implements IEmitsIl, IHasType {
    left: Zingle;
    right?: Zingle;
    operation: Operator;

    typeReference: TypeReference;

    static fromComponents(components: Component[]): Zingle {
        // console.log({components})

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

        this.left.determineTypeReference(scope);

        switch(this.operation.value) {
            case Operation.Access:
                if(this.right instanceof Identifier) {
                    let accessedMember = this.left.typeReference.class.getMember(this.right?.value);

                    if(!accessedMember) throw new Error("couldnt access member");

                    this.typeReference = accessedMember.type;
                }

                break;
            default:                
                if(!(this.right instanceof Generic || this.right instanceof ExpressionList)) {
                    this.right?.determineTypeReference(scope);

                    if(this.left.typeReference != this.right?.typeReference) throw new Error("left and right side dont match types");

                    this.typeReference = this.left.typeReference;
                }
        }
    }

    emitIl(emitter: IlEmitter) {
        if(this.left instanceof Generic) throw new Error("weird generic position 2 electric boogaloo left side");
        if(this.right instanceof Generic) throw new Error("weird generic position 2 electric boogaloo right side");

        switch(this.operation.value) {
            case Operation.Declare:
                this.right?.emitIl(emitter);
            case Operation.Access:
                //rightType = emitter.blahblahblah
                
            case Operation.Index:
            case Operation.Call:
            case Operation.Assign:
        }

        this.left.emitIl(emitter);
        this.right?.emitIl(emitter);
        this.operation.emitIl(emitter);
    }
}

/*
bingle.zingle[0] = hello(Int32 buh = 5, bongle.b);

left
right
index
*/