import { IL } from "../IL/IL";

export class ILEmitter {
    emit<T extends typeof IL.Opcode, U = T extends IL.Opcode.Add ? string : string>(opcode: T, operand: U) {

    }

    defineLabel(){

    }
    
    markLabel() {

    }
}