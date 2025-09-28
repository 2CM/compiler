import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { ThingInformation } from "../SemanticAnalyzer/ThingInformation/ThingInformation";
import { TypeParameterInformation } from "../SemanticAnalyzer/ThingInformation/TypeParameterInformation";
import { TypeReference } from "../SemanticAnalyzer/TypeReference";
import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { ElementMatcher } from "./ElementMatcher";
import { Generic } from "./Generic";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";

export class Type extends SyntacticElement {
    identifiers: Identifier[] = [];
    generic?: Generic;

    static match(matcher: ElementMatcher) {
        matcher.matchType(TokenType.Identifier);

        matcher.finishLazy();

        while(matcher.going) {
            yourtakingtoolong();

            if(matcher.matchValueOptional(".")) {
                matcher.matchType(TokenType.Identifier);
            } else {
                break;
            }
        }

        matcher.matchElementOptional(Generic);

        return matcher.finish();
    }

    static read(self: Type, builder: ElementBuilder) {
        while(builder.going) {
            self.identifiers.push(builder.readElement(Identifier));

            if(!builder.advancePastValue(".")) break;
        }

        if(builder.matchElement(Generic)) {
            self.generic = builder.readElement(Generic);
        }

        return builder.finish();
    }

    getTypeReference(current: ThingInformation): TypeReference {
        if(current instanceof ClassInformation) {
            let typeParameterMatch = current.typeParameters.find(parameter => parameter.name == this.identifiers[0].value);
            
            if(typeParameterMatch) return create(new TypeReference(), obj => {
                obj.typeParameter = typeParameterMatch;
            });
        }

        while(true) {
            yourtakingtoolong();

            if(
                (
                    (current instanceof ClassInformation || current instanceof NamespaceInformation) &&
                    current.classes[this.identifiers[0].value]
                ) ||
                (
                    current instanceof NamespaceInformation &&
                    current.namespaces[this.identifiers[0].value]
                )
            ) {
                break;
            }

            if(!current.parent) break;

            current = current.parent;
        }

        for(let identifer of this.identifiers) {
            if((current instanceof ClassInformation || current instanceof NamespaceInformation) && current?.classes[identifer.value]) {
                current = current.classes[identifer.value];
            } else if(current instanceof NamespaceInformation && current?.namespaces[identifer.value]) {
                current = current.namespaces[identifer.value];
            } else {
                throw new Error(`what do you mean ${this.toString()}`);
            }
        }
        
        if(!(current instanceof ClassInformation)) throw new Error("not a type");

        return create(new TypeReference(), obj => {
            obj.class = current;
            
            if(this.generic) {
                if(this.generic.types.length != obj.class.typeParameters.length) throw new Error("incorrect amount of type arguments")

                obj.generic = this.generic.types.map(type => type.getTypeReference(current));
            }
        })
    }

    toString(): string {
        return this.identifiers.map(identifier => identifier.value).join(".") + (this.generic ? `<${this.generic.toString()}>` : "")
    }
}