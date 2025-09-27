import { IL } from "../IL/IL";
import { IHasScope } from "../SemanticAnalyzer/IHasScope";

type NumericOpcodes = 
    IL.Opcode.Ldc_i4 |
    IL.Opcode.Ldarg

type VoidOpcodes = 
    IL.Opcode.Add

export interface IEmitsIl {
    emitIl(emitter: IlEmitter): void
}

export class IlEmitter {
    scopes: IHasScope[]

    emit<T extends IL.Opcode, U = T extends NumericOpcodes ? number : T extends VoidOpcodes ? null : string>(opcode: T, operand: U) {

    }

    

    defineLabel(){

    }
    
    markLabel() {

    }

    getInstructions() {
        return [] as IL.Instruction[];
    }
}