import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Field } from "./Field";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { Method } from "./Method";
import { SyntacticElement } from "./SyntacticElement";
import { Generic } from "./Generic";
import { Type } from "./Type";
import { ElementBuilder } from "./ElementBuilder";
import { Member } from "./Member";
import { ModifierList } from "./ModifierList";
import { IdentifierInformation, IdentifierReferenceType, IHasScope } from "../SemanticAnalyzer/IHasScope";
import { IHasId } from "../SemanticAnalyzer/IHasId";
import { ICreatesIlThing } from "../IntermediateCodeGenerator/ICreatesIlThing";
import { IL } from "../IL/IL";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { ElementMatcher } from "./ElementMatcher";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { TypeParameterInformation } from "../SemanticAnalyzer/ThingInformation/TypeParameterInformation";
import { Scope } from "../SemanticAnalyzer/Scope";
import { ProgramBody } from "./ProgramBody";
import { ThingInformation } from "../SemanticAnalyzer/ThingInformation/ThingInformation";

export class Class extends SyntacticElement implements IHasScope, IHasId, ICreatesIlThing<IL.Class>, IGeneratesSemanticInformation<ClassInformation> {
    modifiers: ModifierList;
    name: Identifier;
    typeParameters: Identifier[] = [];
    extends: Type[] = [];
    body: (Member | Class)[] = [];

    scope: Scope;

    id: string;

    semanticInformation: ClassInformation;

    static match(matcher: ElementMatcher): boolean {
        matcher.matchElementOptional(ModifierList, false);
        matcher.matchValue("class");

        return matcher.finish();
    }

    static read(self: Class, builder: ElementBuilder) {
        //modifiers
        if(builder.matchElement(ModifierList)) {
            self.modifiers = builder.readElement(ModifierList);
        }

        builder.advancePastExpectedValue("class");

        
        //class name
        self.name = builder.readElement(Identifier);

        if(builder.advancePastValue("<")) {
            while(builder.going) {
                yourtakingtoolong();

                self.typeParameters.push(builder.readElement(Identifier));

                if(!builder.advancePastValue(",")) break;
            }

            builder.advancePastExpectedValue(">");
        }

        //inheritance
        if(builder.advancePastValue(":")) {
            while(builder.going) {
                self.extends.push(builder.readElement(Type));
                
                if(!builder.advancePastValue(",")) break;
            }
        }

        builder.advancePastExpectedValue("{");

        //body
        while(builder.going) {
            yourtakingtoolong();

            if(builder.advancePastValue("}")) break;

            if(builder.matchElement(Class)) {
                self.body.push(builder.readElement(Class));
            }

            self.body.push(builder.readElement(Member));

            // let element = SyntacticElement.fromPossibleElements(tokens, i, [Field, Method]);

            // if(element) {
            //     self.body.push(element);
            //     i = element.endIndex;
            // } else {
            //     throw new Error("bad");
            // }
        }

        return builder.finish();
    }

    createId(parentId: string) {
        this.id = (parentId ? `${parentId}.` : "") + this.name.value;
    }

    registerIdentifiers(parent: ProgramBody) {
        this.scope = new Scope(this.semanticInformation, parent.scope);

        for(let member of this.body) {
            if(member instanceof Field || member instanceof Method) {
                // member.createId(this.id);

                this.scope.identifiers[member.name.value] = new IdentifierInformation(
                    member instanceof Field ?
                        IdentifierReferenceType.Field :
                        IdentifierReferenceType.Method,
                    member.name.value,
                    member.semanticInformation.type
                )

                if(member instanceof Method) {
                    member.registerIdentifiers(this);
                }
            }
        }
    }

    generateSemanticOutline(parent: NamespaceInformation | ClassInformation) {
        parent.classes[this.name.value] = create(new ClassInformation(parent), obj => {
            obj.name = this.name.value;
            
            for(let member of this.body) {
                if(member instanceof Class) {
                    member.generateSemanticOutline(obj);
                }
            }

            this.semanticInformation = obj;
        })
    }

    generateSemanticInformation(parent: ThingInformation) {
        this.semanticInformation.typeParameters = this.typeParameters.map(parameter => create(new TypeParameterInformation(this.semanticInformation), obj => {
            obj.name = parameter.value;
        }));
        
        this.semanticInformation.extends = this.extends.map(type => type.getTypeReference(this.semanticInformation));
        
        for(let member of this.body) {
            member.generateSemanticInformation(this.semanticInformation);
        }
    }

    annotateWithTypeReferences(scope: any) {

    }

    createIlThing() {
        return create(new IL.Class(), obj => {
            obj.fullName = this.id;
            obj.name = this.name.value;
            obj.attributes = [];
            
            let fieldOffset = 0;

            for(let member of this.body) {
                if(member instanceof Field) {
                    obj.fields.push(member.createIlThing(fieldOffset));

                    fieldOffset += 4;
                }

                if(member instanceof Method) {
                    obj.methods.push(member.createIlThing());
                }
            }
        })
    }
}