import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Class } from "./Class";
import { ElementBuilder } from "./ElementBuilder";
import { ElementMatcher } from "./ElementMatcher";
import { ModifierList } from "./ModifierList";
import { ProgramBody } from "./ProgramBody";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";

export class Namespace extends SyntacticElement implements IGeneratesSemanticInformation<NamespaceInformation> {
    identifiers: Identifier[] = [];
    body?: ProgramBody;

    semanticInformation: NamespaceInformation;

    static match(matcher: ElementMatcher): boolean {
        matcher.matchValue("namespace");

        return matcher.finish();
    }

    static read(self: Namespace, builder: ElementBuilder) {
        builder.advancePastExpectedValue("namespace");

        while(builder.going) {
            yourtakingtoolong();

            self.identifiers.push(builder.readElement(Identifier));

            if(!builder.advancePastValue(".")) break;
        }

        if(builder.advancePastValue("{")) {
            self.body = builder.readElement(ProgramBody);
        } else {
            builder.advancePastExpectedValue(";");
        }

        return builder.finish();
    }

    generateSemanticOutline(tree: NamespaceInformation) {
        let current = tree;
        
        for(let identifier of this.identifiers) {
            if(!current.namespaces[identifier.value]) {
                current.namespaces[identifier.value] =
                    create(new NamespaceInformation, obj => {
                        obj.name = identifier.value
                    });
            }

            current = current.namespaces[identifier.value];
        }

        this.body?.generateSemanticOutline(current);
        this.semanticInformation = current;
    }

    generateSemanticInformation(path: (NamespaceInformation | ClassInformation)[]) {
        this.body?.generateSemanticInformation(path);
    }
}