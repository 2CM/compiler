import { yourtakingtoolong } from "../Utils/Utils";
import { Body } from "./Body";
import { Parameter } from "./Parameter";
import { Generic } from "./Generic";
import { ElementBuilder } from "./ElementBuilder";
import { SyntacticElement } from "./SyntacticElement";
import { TokenType } from "../Tokenizer/Token";
import { IdentifierInformation, IdentifierMap, IdentifierReferenceType, IHasScope } from "../SemanticAnalyzer/IHasScope";
import { ModifierList } from "./ModifierList";
import { Type } from "./Type";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { IHasId } from "../SemanticAnalyzer/IHasId";
import { Member } from "./Member";

export class Method extends Member implements IHasScope, IHasId {
    generic: Generic;
    parameters: Parameter[];
    body: Body;

    identifiers: IdentifierMap = {};

    id: string

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
        this.id = `${this.type.toString()} ${parentId}::${this.name.value}${this.generic.toString()}(${this.parameters.map(parameter => parameter.type.name.value).join(", ")})`
    }

    registerIdentifiers() {
        this.identifiers = {};

        let counter = this.modifiers?.body.find(keyword => keyword.value == "static") ? 0 : 1;

        for(let parameter of this.parameters) {
            this.identifiers[parameter.name.value] = new IdentifierInformation(
                IdentifierReferenceType.Argument,
                counter++,
                parameter.type.name.value
            );
        }

        this.body.registerIdentifiers(0);
    }
}