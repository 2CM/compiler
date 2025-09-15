import { IdentifierInformation, IdentifierMap, IdentifierReferenceType, IHasScope } from "../SemanticAnalyzer/IHasScope";
import { Token, TokenType } from "../Tokenizer/Token";
import { create, enumValue, yourtakingtoolong } from "../Utils/Utils";
import { Class } from "./Class";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";

export class SyntaxTree extends SyntacticElement implements IHasScope {
    body: Class[] = [];

    identifiers: IdentifierMap = {};

    static read(self: SyntaxTree, builder: ElementBuilder) {
        while(builder.going) {
            yourtakingtoolong();

            self.body.push(builder.readElement(Class));
        }

        return builder.finish();
    }

    registerIdentifiers() {
        for(let item of this.body) {
            item.createId("");

            this.identifiers[item.name.value] = new IdentifierInformation(
                IdentifierReferenceType.Type,
                item.id
            )
        }

        for(let item of this.body) {
            item.registerIdentifiers();
        }
    }
}