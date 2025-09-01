export namespace IL {
    export enum Opcode {
        //loading
        Ldc_i4,
        Ldstr,
        
        Ldfld,
        Ldsfld,
        Ldarg,
        Ldloc,
        Ldelem,

        //storing
        Stfld,
        Stsfld,
        Stloc,
        Stelem,

        //calling
        Call,
        Callvirt,
        Newobj,
        Newarr,
        Ret,

        //branching
        Beq,
        Bge,
        Blt,
        Bgt,
        Ble,
        Br,
        Brfalse,
        Brtrue,

        //logic
        Not,
        Mul,
        Div,
        Add,
        Sub,

        //stack
        Dup,
        Pop,
    }

    export class Instruction {
        opcode: Opcode;
        operand?: number | string;

        constructor(opcode: Opcode, operand?: number | string) {
            this.opcode = opcode;
            this.operand = operand;
        }

        toString() {
            return Opcode[this.opcode].toLowerCase().replaceAll("_", ".") + (this.operand !== undefined ? " " + this.operand : "");
        }
    }

    export enum Attribute {
        //access
        Public,
        Private,
        Protected,

        //idk what to call this one
        Virtual,
        Abstract,
        
        //idk what to call this one either
        Instance,
        Static,
    }

    abstract class AbstractDirective {
        attributes: Attribute[] = [];
    }

    export class Class extends AbstractDirective {
        name: string = "";
        classes: Class[] = [];
        fields: Field[] = [];
        methods: Method[] = [];
        size: number = 0;
        extends: string | null = null;

        fullName: string;
    }

    export class Field extends AbstractDirective {
        name: string = "";
        type: string = "";
        offset: number = 0;

        fullName: string;
    }

    export class Method extends AbstractDirective {
        name: string = "";
        returnType: string = "";
        locals: Local[] = [];
        parameters: Parameter[] = [];
        body: IL.Instruction[] = [];

        fullName: string;

        get parameterLength() {
            return this.parameters.length + (this.attributes.includes(Attribute.Instance) ? 1 : 0);
        }
    }

    export class Local {
        name: string = "";
        type: string = "";
        index: number = 0;
    }

    export class Parameter {
        name: string = "";
        type: string = "";
        index: number = 0;
    }

    export class Program {
        classes: Class[] = [];
    }

    export type Thing = Program | Class | Method | Field
}