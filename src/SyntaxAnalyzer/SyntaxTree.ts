import { IL } from "../IL/IL";
import { ICreatesIlThing } from "../IntermediateCodeGenerator/ICreatesIlThing";
import { IGeneratesSemanticInformation } from "../SemanticAnalyzer/IGeneratesSemanticInformation";
import { IdentifierInformation, IdentifierMap, IdentifierReferenceType, IHasScope } from "../SemanticAnalyzer/IHasScope";
import { ClassInformation } from "../SemanticAnalyzer/ThingInformation/ClassInformation";
import { NamespaceInformation } from "../SemanticAnalyzer/ThingInformation/NamespaceInformation";
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

    identifiers: IdentifierMap = {};

    semanticInformation: NamespaceInformation;

    static read(self: SyntaxTree, builder: ElementBuilder) {
        while(builder.matchElement(UsingStatement)) {
            yourtakingtoolong();

            self.usings.push(builder.readElement(UsingStatement));
        }

        self.body = builder.readElement(ProgramBody);

        return builder.finish();
    }

    // registerIdentifiers() {
    //     for(let item of this.body) {
    //         item.createId("");

    //         this.identifiers[item.name.value] = new IdentifierInformation(
    //             IdentifierReferenceType.Type,
    //             item.id
    //         )
    //     }

    //     for(let item of this.body) {
    //         item.registerIdentifiers();
    //     }
    // }

    generateSemanticOutline(root: NamespaceInformation) {
        this.body.generateSemanticOutline(root);
        this.semanticInformation = root;
    }

    generateSemanticInformation(path: (NamespaceInformation | ClassInformation)[]) {
        this.body.generateSemanticInformation(path);
    }

    // createIlThing() {
    //     return create(new IL.Program(), obj => {
    //         obj.classes = this.body.map(class_ => class_.createIlThing());
    //     })
    // }
}