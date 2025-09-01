import { IL } from "../IL/IL";
import { create, formatType, yourtakingtoolong } from "../Utils/Utils";
import { Memory } from "./Memory";

class StackItem {
    method: IL.Method;
    counter: number;
    localsAddress: number;
    argumentsAddress: number;
    evaluationStackAddress: number;
    evaluationStackLength: number;
    
    toString() {
        let locals = this.method.locals.map(local => {
            let type = local.type;
            let name = local.name;
            let value = formatType(Emulator.instance.memory.getInt32(this.localsAddress + local.index * 4), type);
            
            return `\n       ${type} ${name}: ${value}`
        }).join("");


        let arguments_ = new Array(this.method.parameterLength).fill(0).map((_, index) => {
            if(this.method.attributes.includes(IL.Attribute.Instance)) index--;

            let parameter = this.method.parameters[index];

            let type = index < 0 ? "this" : parameter.type;
            let name = index < 0 ? "this" : parameter.name;
            let value = formatType(Emulator.instance.memory.getInt32(this.localsAddress + index * 4), type);
            
            return `\n       ${type} ${name}: ${value}`
        }).join("");


        let stack = new Array(this.evaluationStackLength).fill(0).map((_, index) => {
            return `\n       ${Emulator.instance.memory.getInt32(this.evaluationStackAddress + index * 4).toHexString()}`
        }).join("")

        return `
StackItem:
method: ${this.method.name}
counter: ${this.counter} (${this.method.body[this.counter]?.toString() ?? "null"})
locals: ${locals || "none"}
arguments: ${arguments_ || "none"}
stack: ${stack || "none"}
`
    }
}

export class Emulator {
    static instance: Emulator;

    memory: Memory;
    program: IL.Program;
    counter: number = 0;
    stack: StackItem[] = []

    classLookup: Record<string, IL.Class> = {};

    methodLookup: Record<string, IL.Method> = {};
    methodClassLookup: Record<string, IL.Class> = {};

    fieldLookup: Record<string, IL.Field> = {};
    fieldClassLookup: Record<string, IL.Class> = {};

    classTypeIdLookup: Record<string, number> = {};

    vtable: Record<string, Record<number, IL.Method>> = {};
    // {
    //     "Int32 Car::Bingle(Int32)": {
    //         "Car": {},
    //         "Vehicle": {},
    //     }
    // };

    internalMethods: Record<string, (...data: number[]) => any> = {
        "void Console::WriteLine(Int32)": value => {
            console.log(value);
        },
        "void Console::WriteLine(String)": value => {
            console.log(Emulator.instance.memory.getString(value));
        },
        "String String::Concat(String, String)": (str0, str1) => {
            let str0Length = Emulator.instance.memory.getInt32(str0 + 4);
            let str1length = Emulator.instance.memory.getInt32(str1 + 4);
            let combinedLength = str0Length + str1length;

            let stringAddress = Emulator.instance.memory.allocate(combinedLength + 8);

            this.memory.setInt32(stringAddress + 0, 0) //type
            this.memory.setInt32(stringAddress + 4, combinedLength);
            this.memory.setString(stringAddress + 8, Emulator.instance.memory.getString(str0) + Emulator.instance.memory.getString(str1));

            return stringAddress;
        },
    };


    constructor(size: number, program: IL.Program) {
        Emulator.instance = this;

        this.memory = new Memory(size);
        this.program = program;
        
        this.initLookups();

        let entryMethod = this.methodLookup["void Program::Main()"]

        this.stack.push(create(new StackItem(), obj => {
            obj.method = entryMethod
            obj.counter = 0
            obj.localsAddress = this.memory.allocate(entryMethod.locals.length * 4)
            obj.argumentsAddress = 0
            obj.evaluationStackAddress = this.memory.allocate(32)
            obj.evaluationStackLength = 0
        }));
    }

    initLookups() {
        let typeIdCounter = 0;

        const recur = (curr: IL.Thing, prev: IL.Thing, id: string) => {
            if(curr instanceof IL.Program) {
                curr.classes.forEach(i => recur(i, curr, i.name));
            } else if(curr instanceof IL.Class) {
                curr.fullName = id;
                this.classLookup[id] = curr;
                this.classTypeIdLookup[id] = typeIdCounter++;

                curr.classes.forEach(i => recur(i, curr, id + "." + i.name));
                curr.methods.forEach(i => recur(i, curr, id + "::" + i.name));
                curr.fields.forEach(i => recur(i, curr, id + "." + i.name));
            } else if(curr instanceof IL.Method) {
                id = `${curr.returnType} ${id}(${curr.parameters.map(parameter => parameter.type).join(", ")})`;

                this.methodLookup[id] = curr;
                this.methodClassLookup[id] = prev as IL.Class;
                curr.fullName = id;

                console.log(id)

                if(curr.attributes.includes(IL.Attribute.Virtual)) {
                    if(!this.vtable[id]) this.vtable[id] = {};

                    let inheritedMethod = curr;

                    let classTypeId = this.classTypeIdLookup[this.methodClassLookup[curr.fullName].fullName];

                    while(inheritedMethod) {
                        yourtakingtoolong();

                        let inheritedMethodClass = this.methodClassLookup[inheritedMethod.fullName];

                        this.vtable[inheritedMethod.fullName][classTypeId] = curr;

                        let newFullName = inheritedMethod.fullName.replace(inheritedMethodClass.name, inheritedMethodClass.extends as string);

                        inheritedMethod = this.methodLookup[newFullName];
                    }
                }
            } else if(curr instanceof IL.Field) {
                id = `${curr.type} ${id}`;

                this.fieldLookup[id] = curr;
                this.fieldClassLookup[id] = prev as IL.Class;
                curr.fullName = id;
            }
        }

        recur(this.program, this.program, "");

        console.log(this.vtable)
    }

    step() {
        let stackTop = this.stack[0];

        const assignStackTop = () => {
            let temp = this.stack.at(-1);

            if(!temp) throw new Error("no stack idiot");

            stackTop = temp;
        }

        const handleLogic = (func: (a: number, b: number) => number) => {
            let a = this.memory.getInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - 2) * 4)
            let b = this.memory.getInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - 1) * 4)

            this.memory.setInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - 1) * 4, 0)
            this.memory.setInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - 2) * 4, func(a, b))
            
            stackTop.evaluationStackLength--;
        }
        
        const handleCall = () => {
            let argumentsAddress = stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - ilmethod.parameterLength) * 4;
            let internalMethod = this.internalMethods[instruction.operand as string];
            
            if(internalMethod != null) {
                let argumentValues = [];

                for(let i = 0; i < ilmethod.parameterLength; i++) {
                    argumentValues.push(this.memory.getInt32(argumentsAddress + i * 4))
                }

                let returnValue = internalMethod(...argumentValues);

                stackTop.evaluationStackLength -= ilmethod.parameterLength;

                if(returnValue) push(returnValue)
                
                return;
            }

            this.stack.push(create(new StackItem(), obj => {
                obj.method = ilmethod,
                obj.counter = 0,
                obj.localsAddress = this.memory.allocate(ilmethod.locals.length * 4),
                obj.argumentsAddress = argumentsAddress,
                obj.evaluationStackAddress = this.memory.allocate(32),
                obj.evaluationStackLength = 0
            }))

            dontIncrementCounter = true;
        }

        const push = (value: number) => {
            this.memory.setInt32(
                stackTop.evaluationStackAddress + stackTop.evaluationStackLength * 4, 
                value
            );

            stackTop.evaluationStackLength++;
        }

        const pop = (): number => {
            stackTop.evaluationStackLength--;

            return this.memory.getInt32(stackTop.evaluationStackAddress + stackTop.evaluationStackLength * 4);
        }

        const insert = (index: number, value: number) => {
            for(let i = stackTop.evaluationStackLength; i > index; i--) {
                let value = this.memory.getInt32(stackTop.evaluationStackAddress + (i - 1) * 4);

                this.memory.setInt32(
                    stackTop.evaluationStackAddress + i * 4, 
                    value
                );
            }

            this.memory.setInt32(
                stackTop.evaluationStackAddress + index * 4,
                value
            );

            stackTop.evaluationStackLength++;
        }

        assignStackTop();

        let instruction = stackTop.method.body[stackTop.counter];
        if(!instruction) return false;

        // console.log(this.memory)
        // console.log(...this.stack)
        console.log(instruction)

        // if(breakpoints.has(instruction)) {
        //     console.log("BREAKPOINT REACHED")
        //     console.log(...this.stack)
        //     console.log(this.memory)
        // }

        let dontIncrementCounter = false;

        let ilclass = this.classLookup[instruction.operand as string];
        let ilmethod = this.methodLookup[instruction.operand as string];
        let ilfield = this.fieldLookup[instruction.operand as string];

        switch(instruction.opcode) {
            case IL.Opcode.Ldc_i4: {
                push(instruction.operand as number);
                
                break;
            }
            case IL.Opcode.Ldstr: {
                let stringAddress = this.memory.allocate((instruction.operand as string).length + 8)

                this.memory.setInt32(stringAddress + 0, 0) //type
                this.memory.setInt32(stringAddress + 4, (instruction.operand as string).length)
                this.memory.setString(stringAddress + 8, instruction.operand as string);

                push(stringAddress)
                
                break;
            }
            case IL.Opcode.Ldfld: {
                if(!ilfield) throw new Error(`couldnt find field ${instruction.operand}`);

                let objectAddress = pop();

                push(this.memory.getInt32(objectAddress + ilfield.offset));
                
                break;
            }
            case IL.Opcode.Ldarg: {
                let argumentValue = this.memory.getInt32(stackTop.argumentsAddress + (instruction.operand as number) * 4);

                push(argumentValue);
                
                break;
            }
            case IL.Opcode.Ldloc: {
                let localValue = this.memory.getInt32(stackTop.localsAddress + (instruction.operand as number) * 4);

                push(localValue);
                
                break;
            }
            case IL.Opcode.Stloc: {
                let value = pop();

                this.memory.setInt32(
                    stackTop.localsAddress + (instruction.operand as number) * 4, 
                    value
                );
                
                break;
            }
            case IL.Opcode.Stfld: {
                if(!ilfield) throw new Error(`couldnt find field ${instruction.operand}`);

                let newValue = pop();
                let objectAddress = pop();

                this.memory.setInt32(objectAddress + ilfield.offset, newValue);
                
                break;
            }
            case IL.Opcode.Add: handleLogic((a, b) => a + b); break;
            case IL.Opcode.Mul: handleLogic((a, b) => a * b); break;
            case IL.Opcode.Newobj: {
                if(!ilmethod) throw new Error(`couldnt find method ${instruction.operand}`);

                let newObjectAddress = this.memory.allocate(this.methodClassLookup[instruction.operand as string].size);

                insert(stackTop.evaluationStackLength - ilmethod.parameterLength + 1, newObjectAddress);

                this.memory.setInt32(newObjectAddress, this.classTypeIdLookup[this.methodClassLookup[instruction.operand as string].fullName]);

                handleCall();

                break;
            }
            case IL.Opcode.Call: {
                if(!ilmethod) throw new Error(`couldnt find method ${instruction.operand}`);

                handleCall();

                break;
            }
            case IL.Opcode.Callvirt: {
                if(!ilmethod) throw new Error(`couldnt find method ${instruction.operand}`);

                console.log(this.memory)
                console.log(this.vtable)

                let address = this.memory.getInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - ilmethod.parameterLength) * 4);
                let typeId = this.memory.getInt32(address);

                console.log(instruction.operand)

                ilmethod = this.vtable[instruction.operand as string][typeId]

                handleCall();

                break;
            }
            case IL.Opcode.Ret: {
                let exitingMethod = stackTop.method;
                let returnValue = this.memory.getInt32(stackTop.evaluationStackAddress); //idk how to handle this properly

                this.memory.free(stackTop.localsAddress);
                this.memory.free(stackTop.evaluationStackAddress);
                this.memory.free(stackTop.argumentsAddress);

                this.stack.pop();

                assignStackTop();

                for(let i = 0; i < exitingMethod.parameterLength; i++) {
                    stackTop.evaluationStackLength--;

                    this.memory.setInt32(stackTop.evaluationStackAddress + stackTop.evaluationStackLength * 4, 0);
                }

                push(returnValue);

                break;
            }
        }

        if(!dontIncrementCounter) stackTop.counter++;

        return true;
    }
    
    run() {
        while(this.step()) {
            yourtakingtoolong();

            continue;
        }
    }
}