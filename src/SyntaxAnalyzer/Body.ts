import { IL } from "../IL/IL";
import { ICreatesIlThing } from "../IntermediateCodeGenerator/ICreatesIlThing";
import { IlEmitter } from "../IntermediateCodeGenerator/IlEmitter";
import { hasScope, IdentifierInformation, IdentifierReferenceType, IHasScope } from "../SemanticAnalyzer/IHasScope";
import { Scope } from "../SemanticAnalyzer/Scope";
import { Token } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { Expression } from "./Expression";
import { Line } from "./Line";
import { LocalDeclaration } from "./LineContent/LocalDeclaration";
import { Method } from "./Method";
import { Operation } from "./Operation";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";
import { Type } from "./Type";

export class Body extends SyntacticElement implements IHasScope, ICreatesIlThing<IL.Instruction[]> {
    body: Line[] = [];

    scope: Scope;

    static read(self: Body, builder: ElementBuilder) {
        builder.advancePastValue("{");
        
        while(builder.going) {
            yourtakingtoolong();

            if(builder.matchValue("}", "case", "default")) {
                break;
            }

            self.body.push(builder.readElement(Line));
        }

        return builder.finish();
    }

    registerIdentifiers(parent: Method) {
        this.scope = new Scope(parent.semanticInformation, parent.scope);

        let counter = 0;

        for(let line of this.body) {
            let lineBody = line.body;

            if(lineBody instanceof LocalDeclaration) {
                this.scope.identifiers[lineBody.name.value] = create(new IdentifierInformation(), obj => {
                    obj.referenceType = IdentifierReferenceType.Local;
                    obj.name = lineBody.name.value;
                    obj.type = lineBody.type.getTypeReference(parent.semanticInformation);
                });
            }

            if(lineBody instanceof Expression) {
                lineBody.determineTypeReference(this.scope);
            }
            
            // if(
            //     line instanceof Expression &&
            //     line.operation.value == Operation.Assign &&
                
            //     line.left instanceof Expression &&
            //     line.left.operation.value == Operation.Declare
            // ) {
            //     this.identifiers[(line.left.right as Identifier).value] = new IdentifierInformation(
            //         IdentifierReferenceType.Local,
            //         (line.left.right as Identifier).value,
            //         (line.left.left as Type).getTypeReference()
            //     )
            // } else if(hasScope(line)) {
            //     offset += line.registerIdentifiers(offset) ?? 0;
            // }
        }

        return counter;
    }

    createIlThing() {
        let emitter = new IlEmitter();

        for(let line of this.body) {
            line.body.emitIl(emitter);
        }

        return emitter.getInstructions();
    }
}