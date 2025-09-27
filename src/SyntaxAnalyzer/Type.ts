import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
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

    getTypeReference(path: (NamespaceInformation | ClassInformation)[]): TypeReference {
        let current: NamespaceInformation | ClassInformation | null = null;
        let front = path.at(-1);

        if(front instanceof ClassInformation) {
            let typeParameterMatch = front.typeParameters.find(parameter => parameter.name == this.identifiers[0].value);
            
            if(typeParameterMatch) return create(new TypeReference(), obj => {
                obj.typeParameter = typeParameterMatch;
            });
        }

        for(let i = path.length - 1; i >= 0; i --) {
            let item = path[i];

            if(
                item.classes[this.identifiers[0].value] ||
                (item instanceof NamespaceInformation && item.namespaces[this.identifiers[0].value])
            ) {
                current = item;

                break;
            }
        }

        for(let identifer of this.identifiers) {
            if(current?.classes[identifer.value]) {
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

                obj.generic = this.generic.types.map(type => type.getTypeReference(path));
            }
        })
    }

    toString(): string {
        return this.identifiers.map(identifier => identifier.value).join(".") + (this.generic ? `<${this.generic.toString()}>` : "")
    }
}