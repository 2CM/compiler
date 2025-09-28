import { Token, TokenType } from "../Tokenizer/Token";
import { create } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";
import { ElementBuilder } from "./ElementBuilder";
import { Type } from "./Type";
import { ICreatesIlThing } from "../IntermediateCodeGenerator/ICreatesIlThing";
import { IL } from "../IL/IL";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { ParameterInformation } from "../SemanticAnalyzer/ThingInformation/ParameterInformation";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { ThingInformation } from "../SemanticAnalyzer/ThingInformation/ThingInformation";
import { MemberInformation } from "../SemanticAnalyzer/ThingInformation/MemberInformation";
import { MethodInformation } from "../SemanticAnalyzer/ThingInformation/MethodInformation";

export class Parameter extends SyntacticElement implements ICreatesIlThing<IL.Parameter>, IGeneratesSemanticInformation<ParameterInformation> {
    type: Type;
    name: Identifier;
    defaultValue: Zingle;

    semanticInformation: ParameterInformation;

    static read(self: Parameter, builder: ElementBuilder) {
        self.type = builder.readElement(Type);
        self.name = builder.readElement(Identifier);
        
        if(builder.advancePastValue("=")) {
            self.defaultValue = builder.readElement(Expression);
        }

        return builder.finish();
    }

    generateSemanticInformation(parent: MethodInformation) {
        this.semanticInformation = create(new ParameterInformation(parent), obj => {
            obj.type = this.type.getTypeReference(parent);
            obj.name = this.name.value;
        });

        parent.parameters.push(this.semanticInformation);
    }

    createIlThing(index: number) {
        return create(new IL.Parameter(), obj => {
            obj.type = this.type.toString();
            obj.name = this.name.value;
        })
    }
}