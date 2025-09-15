import { hasScope, IdentifierInformation, IdentifierMap, IdentifierReferenceType, IHasScope } from "../SemanticAnalyzer/IHasScope";
import { Token } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { Expression } from "./Expression";
import { Line } from "./Line";
import { Operation } from "./Operation";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";

export class Body extends SyntacticElement implements IHasScope {
    body: Line[] = [];

    identifiers: IdentifierMap = {};

    static read(self: Body, builder: ElementBuilder) {
        builder.advancePastValue("{");
        
        while(builder.going) {
            yourtakingtoolong();

            if(builder.checkValue("}", "case", "default")) {
                break;
            }

            self.body.push(builder.readElement(Line));
        }

        return builder.finish();
    }

    registerIdentifiers(offset: number) {
        let counter = 0;

        for(let line of this.body) {
            if(
                line instanceof Expression &&
                line.operation.value == Operation.Assign &&
                
                line.left instanceof Expression &&
                line.left.operation.value == Operation.Declare
            ) {
                this.identifiers[(line.left.right as Identifier).value] = new IdentifierInformation(
                    IdentifierReferenceType.Local,
                    offset + counter++,
                    (line.left.left as Identifier).value
                )
            } else if(hasScope(line)) {
                offset += line.registerIdentifiers(offset) ?? 0;
            }
        }

        return counter;
    }
}