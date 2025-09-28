import { IL } from "../IL/IL";
import { ICreatesIlThing } from "../IntermediateCodeGenerator/ICreatesIlThing";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { IdentifierInformation, IdentifierReferenceType, IHasScope } from "../SemanticAnalyzer/IHasScope";
import { Scope } from "../SemanticAnalyzer/Scope";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
import { ThingInformation } from "../SemanticAnalyzer/ThingInformation/ThingInformation";
import { Token, TokenType } from "../Tokenizer/Token";
import { create, enumValue, yourtakingtoolong } from "../Utils/Utils";
import { Class } from "./Class";
import { ElementBuilder } from "./ElementBuilder";
import { ProgramBody } from "./ProgramBody";
import { SyntacticElement } from "./SyntacticElement";
import { UsingStatement } from "./UsingStatement";

export class SyntaxTree extends SyntacticElement implements IHasScope, ICreatesIlThing<IL.Program>, IGeneratesSemanticInformation<NamespaceInformation> {
    usings: UsingStatement[] = [];
    body: ProgramBody;

    scope: Scope;

    semanticInformation: NamespaceInformation;

    static read(self: SyntaxTree, builder: ElementBuilder) {
        while(builder.matchElement(UsingStatement)) {
            yourtakingtoolong();

            self.usings.push(builder.readElement(UsingStatement));
        }

        self.body = builder.readElement(ProgramBody);

        return builder.finish();
    }

    registerIdentifiers() {
        this.body.registerIdentifiers(this);
    }

    generateSemanticOutline(root: NamespaceInformation) {
        this.body.generateSemanticOutline(root);
        this.semanticInformation = root;
    }

    generateSemanticInformation(parent: ThingInformation) {
        this.body.generateSemanticInformation(this.semanticInformation);
    }

    createIlThing() {
        return create(new IL.Program(), obj => {
            // obj.classes = this.body.map(class_ => class_.createIlThing());
        })
    }
}