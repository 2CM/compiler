import { Token } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Line } from "./Line";
import { SyntacticElement } from "./SyntacticElement";

export class Body extends SyntacticElement {
    body: Line[] = [];

    static fromTokens(tokens: Token[], startIndex: number): Body {
        let i = startIndex;
        let self = create(new Body(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        if(tokens[i].checkValueOrThrow("{")) i++;
        
        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == "}") {
                self.endIndex = i + 1;

                break;
            }

            let line = Line.fromTokens(tokens, i);

            self.body.push(line);

            i = line.endIndex;
        }

        return self;
    }
}