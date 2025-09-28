import { create, yourtakingtoolong } from "../Utils/Utils";
import { Body } from "./Body";
import { Parameter } from "./Parameter";
import { Generic } from "./Generic";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";
import { TokenType } from "../Tokenizer/Token";
import { IdentifierInformation, IdentifierReferenceType, IHasScope } from "../SemanticAnalyzer/IHasScope";
import { ModifierList } from "./ModifierList";
import { Type } from "./Type";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { IHasId } from "../SemanticAnalyzer/IHasId";
import { Member } from "./Member";
import { ICreatesIlThing } from "../IntermediateCodeGenerator/ICreatesIlThing";
import { IL } from "../IL/IL";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { MethodInformation } from "../SemanticAnalyzer/ThingInformation/MethodInformation";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { Scope } from "../SemanticAnalyzer/Scope";
import { Class } from "./Class";

export class Method extends Member implements IHasScope, IHasId, ICreatesIlThing<IL.Method>, IGeneratesSemanticInformation<MethodInformation> {
    generic: Generic;
    parameters: Parameter[];
    body: Body;

    scope: Scope;

    id: string;

    declare semanticInformation: MethodInformation;

    static read(self: Method, builder: ElementBuilder) {
        self.parameters = [];

        if(builder.matchElement(Generic)) {
            self.generic = builder.readElement(Generic);
        }

        builder.advancePastExpectedValue("(");
        
        while(builder.going) {
            yourtakingtoolong();
            
            if(builder.checkType(TokenType.Identifier)) {
                self.parameters.push(builder.readElement(Parameter));

                if(builder.advancePastValue(",")) continue;
            }
            
            if(builder.advancePastExpectedValue(")")) break;
        }

        self.body = builder.readElement(Body);

        builder.advancePastExpectedValue("}");

        return builder.finish();
    }

    createId(parentId: string) {
        // this.id = `${this.type.toString()} ${parentId}::${this.name.value}${this.generic.toString()}(${this.parameters.map(parameter => parameter.type.name.value).join(", ")})`
    }

    registerIdentifiers(parent: Class) {
        this.scope = new Scope(this.semanticInformation, parent.scope);

        // let counter = this.modifiers?.body.find(keyword => keyword.value == "static") ? 0 : 1;

        for(let parameter of this.parameters) {
            this.scope.identifiers[parameter.name.value] = new IdentifierInformation(
                IdentifierReferenceType.Argument,
                parameter.name.value,
                parameter.semanticInformation.type
            );
        }

        this.body.registerIdentifiers(this);
    }

    generateSemanticInformation(parent: ClassInformation) {
        parent.methods[this.name.value] = create(new MethodInformation(parent), obj => {
            obj.name = this.name.value;
            obj.type = this.type.getTypeReference(parent);
            
            for(let parameter of this.parameters) {
                parameter.generateSemanticInformation(obj);
            }

            this.semanticInformation = obj;
        })
    }
    
    createIlThing() {
        return create(new IL.Method(), obj => {
            obj.attributes = this.modifiers.createIlThing();
            obj.returnType = this.type.toString();
            obj.name = this.name.value;
            obj.fullName = this.id;
            obj.parameters = this.parameters.map((param, i) => param.createIlThing(i));
            obj.body = this.body.createIlThing();
            
            // for(let identifierKey in this.identifiers) {
            //     let identifier = this.identifiers[identifierKey];

            //     if(identifier.referenceType == IdentifierReferenceType.Local) {
            //         obj.locals.push(create(new IL.Local(), obj => {
            //             obj.type = identifier.typeId ?? "what";
            //             obj.name = identifierKey;
            //             obj.index = identifier.id as number;
            //         }))
            //     }
            // }
        })
    }    
}