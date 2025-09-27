import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { yourtakingtoolong } from "../Utils/Utils";
import { Class } from "./Class";
import { ElementBuilder } from "./ElementBuilder";
import { Namespace } from "./Namespace";
import { SyntacticElement } from "./SyntacticElement";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";

export class ProgramBody extends SyntacticElement implements IGeneratesSemanticInformation<NamespaceInformation> {
    body: (Class | Namespace)[] = [];

    semanticInformation: NamespaceInformation;

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

    generateSemanticOutline(parent: NamespaceInformation) {
        for(let item of this.body) {
            item.generateSemanticOutline(parent);
        }
        
        this.semanticInformation = parent;
    }

    generateSemanticInformation(path: (NamespaceInformation | ClassInformation)[]) {
        for(let item of this.body) {
            item.generateSemanticInformation([...path, item.semanticInformation]);
        }
    }
}