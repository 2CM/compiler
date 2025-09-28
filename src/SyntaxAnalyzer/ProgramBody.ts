import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { yourtakingtoolong } from "../Utils/Utils";
import { Class } from "./Class";
import { ElementBuilder } from "./ElementBuilder";
import { Namespace } from "./Namespace";
import { SyntacticElement } from "./SyntacticElement";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { ThingInformation } from "../SemanticAnalyzer/ThingInformation/ThingInformation";
import { IHasScope } from "../SemanticAnalyzer/IHasScope";
import { Scope } from "../SemanticAnalyzer/Scope";
import { SyntaxTree } from "./SyntaxTree";

export class ProgramBody extends SyntacticElement implements IHasScope, IGeneratesSemanticInformation<NamespaceInformation> {
    body: (Class | Namespace)[] = [];

    semanticInformation: NamespaceInformation;

    scope: Scope;

    static read(self: ProgramBody, builder: ElementBuilder) {
        while(builder.going) {
            yourtakingtoolong();

            if(builder.advancePastValue("}")) break;

            let item = builder.readElementFromPossibilities([Class, Namespace]);

            if(!item) throw new Error("what");

            self.body.push(item);
        }

        return builder.finish();
    }

    registerIdentifiers(parent: Namespace | SyntaxTree) {
        this.scope = new Scope(this.semanticInformation, parent.scope);

        for(let item of this.body) {
            item.registerIdentifiers(this);
        }
    }

    generateSemanticOutline(parent: NamespaceInformation) {
        this.semanticInformation = parent;

        for(let item of this.body) {
            item.generateSemanticOutline(parent);

            if(item instanceof Namespace && !item.body) {
                parent = item.semanticInformation;
            }
        }
    }

    generateSemanticInformation(parent: ThingInformation): void {
        for(let item of this.body) {
            item.generateSemanticInformation(parent);
        }
    }
}