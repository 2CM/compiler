import { Token } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Line } from "./Line";
import { SyntacticElement } from "./SyntacticElement";

export class Body extends SyntacticElement {
    body: Line[] = [];

    static fromTokens(tokens: Token[], startIndex: number, stopOnSwitchSection: boolean = false): Body {
        let i = startIndex;
        let self = create(new Body(), obj => {
            obj.startIndex = startIndex;
            obj.tokenSource = tokens;
        });

        if(tokens[i].value == "{") i++;
        
        while(i < tokens.length) {
            yourtakingtoolong();

            if(tokens[i].value == "}" || (stopOnSwitchSection && ["case", "default"].includes(tokens[i].value))) {
                self.endIndex = i;

                break;
            }

            let line = Line.fromTokens(tokens, i);

            self.body.push(line);

            i = line.endIndex;
        }

        return self;
    }
}