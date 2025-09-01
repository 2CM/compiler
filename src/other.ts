


//#region Utils
console.clear();
// (document.getElementById("log") as HTMLElement).style.fontSize = "11px";
// (document.getElementById("log") as HTMLElement).style.lineHeight = "11px";
(document.getElementById("log") as HTMLElement).style.width = "8000px";
(document.getElementById("log") as HTMLElement).style.fontSize = "12px";
(document.getElementById("log") as HTMLElement).style.lineHeight = "16px";
// (document.getElementsByClassName("playground-sidebar")[0] as HTMLElement).style.width = "800px";
// (document.getElementsByClassName("playground-sidebar")[0] as HTMLElement).style.flexBasis = "800px";
// (document.getElementsByClassName("playground-sidebar")[0] as HTMLElement).style.maxWidth = "800px";

//#endregion Utils

// namespace SyntaxAnalyzer {
//     class UnexpectedTokenError extends Error {
//         constructor(expected: TokenType | string) {
//             super(`expected ${typeof(expected) == "string" ? expected : TokenType[expected]}`);
//         }
//     }
// }

// namespace IntermediateCodeGenerator {
//     function convertOperationToOpcode(operation: SyntaxAnalyzer.Operation): IL.Opcode {
//         let map = {
//             [SyntaxAnalyzer.Operation.Index]: IL.Opcode.Ldelem,
//             [SyntaxAnalyzer.Operation.Multiply]: IL.Opcode.Mul,
//             [SyntaxAnalyzer.Operation.Divide]: IL.Opcode.Div,
//             [SyntaxAnalyzer.Operation.Add]: IL.Opcode.Add,
//             [SyntaxAnalyzer.Operation.Subtract]: IL.Opcode.Sub,
//         };

//         return map[operation as keyof typeof map]; //typescrpt
//     }

//     export function expressionToIL(expression: SyntaxAnalyzer.Expression) {
//         let body: IL.Instruction[] = [];

//         function handleExpressionSide(side: SyntaxAnalyzer.Zingle) {
//             if(side instanceof SyntaxAnalyzer.Expression) {
//                 recur(side);
//             } else if (side instanceof SyntaxAnalyzer.ExpressionList) {
//                 for(let i in side.list) {
//                     handleExpressionSide(side.list[i])
//                 }
//             } else {
//                 if(side.type == TokenType.Identifier) {
//                     body.push(new IL.Instruction(IL.Opcode.Ldfld, side.value));
//                 } else if(side.type == TokenType.Literal) {
//                     body.push(new IL.Instruction(IL.Opcode.Ldc_i4, side.value));
//                 }
//             }
//         }

//         function recur(expression: SyntaxAnalyzer.Expression) {
//             switch(expression.operation) {
//                 case SyntaxAnalyzer.Operation.Call:
//                     if(!expression.right) throw new Error("what");

//                     handleExpressionSide(expression.right);
//                     body.push(new IL.Instruction(IL.Opcode.Call, (expression.left as Token).value));
//                 break;
//                 case SyntaxAnalyzer.Operation.Access:
//                     handleExpressionSide(expression.left);
//                     body.push(new IL.Instruction(IL.Opcode.Ldfld, (expression.right as Token).value));
//                 break;
//                 case SyntaxAnalyzer.Operation.Not:
//                     handleExpressionSide(expression.left);
//                     body.push(new IL.Instruction(IL.Opcode.Not));
//                 break;
//                 default:
//                     if(!expression.right) throw new Error("what");

//                     handleExpressionSide(expression.left);
//                     handleExpressionSide(expression.right);
//                     body.push(new IL.Instruction(convertOperationToOpcode(expression.operation)));
//             }
//         }

//         recur(expression);

//         return body;
//     }

//     export function syntaxTreeToIL(syntaxTree: SyntaxAnalyzer.SyntaxTree): IL.Program {
//         return new IL.Program();
//     }
// }

// //#region IL
// namespace IL {
//     export enum Opcode {
//         //loading
//         Ldc_i4,
//         Ldstr,
        
//         Ldfld,
//         Ldsfld,
//         Ldarg,
//         Ldloc,
//         Ldelem,

//         //storing
//         Stfld,
//         Stsfld,
//         Stloc,
//         Stelem,

//         //calling
//         Call,
//         Callvirt,
//         Newobj,
//         Newarr,
//         Ret,

//         //branching
//         Beq,
//         Bge,
//         Blt,
//         Bgt,
//         Ble,
//         Br,
//         Brfalse,
//         Brtrue,

//         //logic
//         Not,
//         Mul,
//         Div,
//         Add,
//         Sub,

//         //stack
//         Dup,
//         Pop,
//     }

//     export class Instruction {
//         opcode: Opcode;
//         operand?: number | string;

//         constructor(opcode: Opcode, operand?: number | string) {
//             this.opcode = opcode;
//             this.operand = operand;
//         }

//         toString() {
//             return Opcode[this.opcode].toLowerCase().replaceAll("_", ".") + (this.operand !== undefined ? " " + this.operand : "");
//         }
//     }

//     export enum Attribute {
//         //access
//         Public,
//         Private,
//         Protected,

//         //idk what to call this one
//         Virtual,
//         Abstract,
        
//         //idk what to call this one either
//         Instance,
//         Static,
//     }

//     abstract class AbstractDirective {
//         attributes: Attribute[] = [];
//     }

//     export class Class extends AbstractDirective {
//         name: string = "";
//         classes: Class[] = [];
//         fields: Field[] = [];
//         methods: Method[] = [];
//         size: number = 0;
//         extends: string | null = null;

//         fullName: string;
//     }

//     export class Field extends AbstractDirective {
//         name: string = "";
//         type: string = "";
//         offset: number = 0;

//         fullName: string;
//     }

//     export class Method extends AbstractDirective {
//         name: string = "";
//         returnType: string = "";
//         locals: Local[] = [];
//         parameters: Parameter[] = [];
//         body: IL.Instruction[] = [];

//         fullName: string;

//         get parameterLength() {
//             return this.parameters.length + (this.attributes.includes(Attribute.Instance) ? 1 : 0);
//         }
//     }

//     export class Local {
//         name: string = "";
//         type: string = "";
//         index: number = 0;
//     }

//     export class Parameter {
//         name: string = "";
//         type: string = "";
//         index: number = 0;
//     }

//     export class Program {
//         classes: Class[] = [];
//     }

//     export type Thing = Program | Class | Method | Field
// }
// //#endregion IL

// //#region Emulator
// namespace Emulator {
//     export class Memory<T extends ArrayBuffer = ArrayBuffer> extends DataView<T> {
//         encoder: TextEncoder = new TextEncoder();
//         decoder: TextDecoder = new TextDecoder();
//         counter: number = 0;

//         allocatedAddresses: Record<number, number> = {};

//         constructor(size: number) {
//             let buffer = new ArrayBuffer(size) as T;
            
//             super(buffer);
//         }

//         allocate(length: number): number {
//             if(this.counter + length > this.byteLength) throw new Error("out of memory. build that allocator");

//             let address = this.counter;

//             this.counter += length;

//             this.allocatedAddresses[address] = length;

//             return address;
//         }
        
//         free(address: number) {
//             //todo: implement

//             // console.log(address.toHexString())
//             // console.log(this.allocatedAddresses[address]?.toHexString())

//             for(let i = address; i < address + this.allocatedAddresses[address]; i++) {
//                 this.setInt8(i, 0)
//             }
//         }

//         setString(byteOffset: number, value: string) {
//             let encoded = this.encoder.encode(value);

//             for(let i = 0; i < encoded.length; i++) {
//                 this.setInt8(byteOffset + i, encoded[i]);
//             }
//         }

//         getString(byteOffset: number) {
//             let length = this.getInt32(byteOffset + 4);

//             return this.decoder.decode(this.buffer.slice(byteOffset + 8, byteOffset + length + 8));
//         }

//         toString() {
//             let str = "\n      "

//             //legend
//             for(let j = 0; j < 16; j++) {
//                 str += j.toString(16).toUpperCase().padStart(2, "0")

//                 if(j < 15) str += "."
//             }

//             str += "\n"

//             for(let i = 0; i < this.byteLength; i += 16) {
//                 //address
//                 str += i.toString(16).toUpperCase().padStart(4, "0") + "  "

//                 //hex value
//                 for(let j = 0; j < 16; j++) {
//                     str += this.getUint8(i + j).toString(16).toUpperCase().padStart(2, "0")

//                     if(j < 15) str += " "
//                 }

//                 str += "  "

//                 //char value
//                 for(let j = 0; j < 16; j++) {
//                     let byte = this.getUint8(i + j);

//                     str += byte == 0 ? "." : String.fromCharCode(byte);
//                 }

//                 str += "\n"
//             }

//             return str;
//         }
//     }

//     class StackItem {
//         method: IL.Method;
//         counter: number;
//         localsAddress: number;
//         argumentsAddress: number;
//         evaluationStackAddress: number;
//         evaluationStackLength: number;
        
//         toString() {
//             let locals = this.method.locals.map(local => {
//                 let type = local.type;
//                 let name = local.name;
//                 let value = formatType(Emulator.instance.memory.getInt32(this.localsAddress + local.index * 4), type);
                
//                 return `\n       ${type} ${name}: ${value}`
//             }).join("");


//             let arguments_ = new Array(this.method.parameterLength).fill(0).map((_, index) => {
//                 if(this.method.attributes.includes(IL.Attribute.Instance)) index--;

//                 let parameter = this.method.parameters[index];

//                 let type = index < 0 ? "this" : parameter.type;
//                 let name = index < 0 ? "this" : parameter.name;
//                 let value = formatType(Emulator.instance.memory.getInt32(this.localsAddress + index * 4), type);
                
//                 return `\n       ${type} ${name}: ${value}`
//             }).join("");


//             let stack = new Array(this.evaluationStackLength).fill(0).map((_, index) => {
//                 return `\n       ${Emulator.instance.memory.getInt32(this.evaluationStackAddress + index * 4).toHexString()}`
//             }).join("")

//             return `
// StackItem:
//     method: ${this.method.name}
//     counter: ${this.counter} (${this.method.body[this.counter]?.toString() ?? "null"})
//     locals: ${locals || "none"}
//     arguments: ${arguments_ || "none"}
//     stack: ${stack || "none"}
// `
//         }
//     }

//     export class Emulator {
//         static instance: Emulator;

//         memory: Memory;
//         program: IL.Program;
//         counter: number = 0;
//         stack: StackItem[] = []

//         classLookup: Record<string, IL.Class> = {};

//         methodLookup: Record<string, IL.Method> = {};
//         methodClassLookup: Record<string, IL.Class> = {};

//         fieldLookup: Record<string, IL.Field> = {};
//         fieldClassLookup: Record<string, IL.Class> = {};

//         classTypeIdLookup: Record<string, number> = {};

//         vtable: Record<string, Record<number, IL.Method>> = {};
//         // {
//         //     "Int32 Car::Bingle(Int32)": {
//         //         "Car": {},
//         //         "Vehicle": {},
//         //     }
//         // };

//         internalMethods: Record<string, (...data: number[]) => any> = {
//             "void Console::WriteLine(Int32)": value => {
//                 console.log(value);
//             },
//             "void Console::WriteLine(String)": value => {
//                 console.log(Emulator.instance.memory.getString(value));
//             },
//             "String String::Concat(String, String)": (str0, str1) => {
//                 let str0Length = Emulator.instance.memory.getInt32(str0 + 4);
//                 let str1length = Emulator.instance.memory.getInt32(str1 + 4);
//                 let combinedLength = str0Length + str1length;

//                 let stringAddress = Emulator.instance.memory.allocate(combinedLength + 8);

//                 this.memory.setInt32(stringAddress + 0, 0) //type
//                 this.memory.setInt32(stringAddress + 4, combinedLength);
//                 this.memory.setString(stringAddress + 8, Emulator.instance.memory.getString(str0) + Emulator.instance.memory.getString(str1));

//                 return stringAddress;
//             },
//         };


//         constructor(size: number, program: IL.Program) {
//             Emulator.instance = this;

//             this.memory = new Memory(size);
//             this.program = program;
            
//             this.initLookups();

//             let entryMethod = this.methodLookup["void Program::Main()"]

//             this.stack.push(create(new StackItem(), obj => {
//                 obj.method = entryMethod
//                 obj.counter = 0
//                 obj.localsAddress = this.memory.allocate(entryMethod.locals.length * 4)
//                 obj.argumentsAddress = 0
//                 obj.evaluationStackAddress = this.memory.allocate(32)
//                 obj.evaluationStackLength = 0
//             }));
//         }

//         initLookups() {
//             let typeIdCounter = 0;

//             const recur = (curr: IL.Thing, prev: IL.Thing, id: string) => {
//                 if(curr instanceof IL.Program) {
//                     curr.classes.forEach(i => recur(i, curr, i.name));
//                 } else if(curr instanceof IL.Class) {
//                     curr.fullName = id;
//                     this.classLookup[id] = curr;
//                     this.classTypeIdLookup[id] = typeIdCounter++;

//                     curr.classes.forEach(i => recur(i, curr, id + "." + i.name));
//                     curr.methods.forEach(i => recur(i, curr, id + "::" + i.name));
//                     curr.fields.forEach(i => recur(i, curr, id + "." + i.name));
//                 } else if(curr instanceof IL.Method) {
//                     id = `${curr.returnType} ${id}(${curr.parameters.map(parameter => parameter.type).join(", ")})`;

//                     this.methodLookup[id] = curr;
//                     this.methodClassLookup[id] = prev as IL.Class;
//                     curr.fullName = id;

//                     console.log(id)

//                     if(curr.attributes.includes(IL.Attribute.Virtual)) {
//                         if(!this.vtable[id]) this.vtable[id] = {};

//                         let inheritedMethod = curr;

//                         let classTypeId = this.classTypeIdLookup[this.methodClassLookup[curr.fullName].fullName];

//                         while(inheritedMethod) {
//                             yourtakingtoolong();

//                             let inheritedMethodClass = this.methodClassLookup[inheritedMethod.fullName];

//                             this.vtable[inheritedMethod.fullName][classTypeId] = curr;

//                             let newFullName = inheritedMethod.fullName.replace(inheritedMethodClass.name, inheritedMethodClass.extends as string);

//                             inheritedMethod = this.methodLookup[newFullName];
//                         }
//                     }
//                 } else if(curr instanceof IL.Field) {
//                     id = `${curr.type} ${id}`;

//                     this.fieldLookup[id] = curr;
//                     this.fieldClassLookup[id] = prev as IL.Class;
//                     curr.fullName = id;
//                 }
//             }

//             recur(this.program, this.program, "");

//             console.log(this.vtable)
//         }

//         step() {
//             let stackTop = this.stack[0];

//             const assignStackTop = () => {
//                 let temp = this.stack.at(-1);

//                 if(!temp) throw new Error("no stack idiot");

//                 stackTop = temp;
//             }

//             const handleLogic = (func: (a: number, b: number) => number) => {
//                 let a = this.memory.getInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - 2) * 4)
//                 let b = this.memory.getInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - 1) * 4)

//                 this.memory.setInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - 1) * 4, 0)
//                 this.memory.setInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - 2) * 4, func(a, b))
                
//                 stackTop.evaluationStackLength--;
//             }
            
//             const handleCall = () => {
//                 let argumentsAddress = stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - ilmethod.parameterLength) * 4;
//                 let internalMethod = this.internalMethods[instruction.operand as string];
                
//                 if(internalMethod != null) {
//                     let argumentValues = [];

//                     for(let i = 0; i < ilmethod.parameterLength; i++) {
//                         argumentValues.push(this.memory.getInt32(argumentsAddress + i * 4))
//                     }

//                     let returnValue = internalMethod(...argumentValues);

//                     stackTop.evaluationStackLength -= ilmethod.parameterLength;

//                     if(returnValue) push(returnValue)
                    
//                     return;
//                 }

//                 this.stack.push(create(new StackItem(), obj => {
//                     obj.method = ilmethod,
//                     obj.counter = 0,
//                     obj.localsAddress = this.memory.allocate(ilmethod.locals.length * 4),
//                     obj.argumentsAddress = argumentsAddress,
//                     obj.evaluationStackAddress = this.memory.allocate(32),
//                     obj.evaluationStackLength = 0
//                 }))

//                 dontIncrementCounter = true;
//             }

//             const push = (value: number) => {
//                 this.memory.setInt32(
//                     stackTop.evaluationStackAddress + stackTop.evaluationStackLength * 4, 
//                     value
//                 );

//                 stackTop.evaluationStackLength++;
//             }

//             const pop = (): number => {
//                 stackTop.evaluationStackLength--;

//                 return this.memory.getInt32(stackTop.evaluationStackAddress + stackTop.evaluationStackLength * 4);
//             }

//             const insert = (index: number, value: number) => {
//                 for(let i = stackTop.evaluationStackLength; i > index; i--) {
//                     let value = this.memory.getInt32(stackTop.evaluationStackAddress + (i - 1) * 4);

//                     this.memory.setInt32(
//                         stackTop.evaluationStackAddress + i * 4, 
//                         value
//                     );
//                 }

//                 this.memory.setInt32(
//                     stackTop.evaluationStackAddress + index * 4,
//                     value
//                 );

//                 stackTop.evaluationStackLength++;
//             }

//             assignStackTop();

//             let instruction = stackTop.method.body[stackTop.counter];
//             if(!instruction) return false;

//             // console.log(this.memory)
//             // console.log(...this.stack)
//             console.log(instruction)

//             // if(breakpoints.has(instruction)) {
//             //     console.log("BREAKPOINT REACHED")
//             //     console.log(...this.stack)
//             //     console.log(this.memory)
//             // }

//             let dontIncrementCounter = false;

//             let ilclass = this.classLookup[instruction.operand as string];
//             let ilmethod = this.methodLookup[instruction.operand as string];
//             let ilfield = this.fieldLookup[instruction.operand as string];

//             switch(instruction.opcode) {
//                 case IL.Opcode.Ldc_i4: {
//                     push(instruction.operand as number);
                    
//                     break;
//                 }
//                 case IL.Opcode.Ldstr: {
//                     let stringAddress = this.memory.allocate((instruction.operand as string).length + 8)

//                     this.memory.setInt32(stringAddress + 0, 0) //type
//                     this.memory.setInt32(stringAddress + 4, (instruction.operand as string).length)
//                     this.memory.setString(stringAddress + 8, instruction.operand as string);

//                     push(stringAddress)
                    
//                     break;
//                 }
//                 case IL.Opcode.Ldfld: {
//                     if(!ilfield) throw new Error(`couldnt find field ${instruction.operand}`);

//                     let objectAddress = pop();

//                     push(this.memory.getInt32(objectAddress + ilfield.offset));
                    
//                     break;
//                 }
//                 case IL.Opcode.Ldarg: {
//                     let argumentValue = this.memory.getInt32(stackTop.argumentsAddress + (instruction.operand as number) * 4);

//                     push(argumentValue);
                    
//                     break;
//                 }
//                 case IL.Opcode.Ldloc: {
//                     let localValue = this.memory.getInt32(stackTop.localsAddress + (instruction.operand as number) * 4);

//                     push(localValue);
                    
//                     break;
//                 }
//                 case IL.Opcode.Stloc: {
//                     let value = pop();

//                     this.memory.setInt32(
//                         stackTop.localsAddress + (instruction.operand as number) * 4, 
//                         value
//                     );
                    
//                     break;
//                 }
//                 case IL.Opcode.Stfld: {
//                     if(!ilfield) throw new Error(`couldnt find field ${instruction.operand}`);

//                     let newValue = pop();
//                     let objectAddress = pop();

//                     this.memory.setInt32(objectAddress + ilfield.offset, newValue);
                    
//                     break;
//                 }
//                 case IL.Opcode.Add: handleLogic((a, b) => a + b); break;
//                 case IL.Opcode.Mul: handleLogic((a, b) => a * b); break;
//                 case IL.Opcode.Newobj: {
//                     if(!ilmethod) throw new Error(`couldnt find method ${instruction.operand}`);

//                     let newObjectAddress = this.memory.allocate(this.methodClassLookup[instruction.operand as string].size);

//                     insert(stackTop.evaluationStackLength - ilmethod.parameterLength + 1, newObjectAddress);

//                     this.memory.setInt32(newObjectAddress, this.classTypeIdLookup[this.methodClassLookup[instruction.operand as string].fullName]);

//                     handleCall();

//                     break;
//                 }
//                 case IL.Opcode.Call: {
//                     if(!ilmethod) throw new Error(`couldnt find method ${instruction.operand}`);

//                     handleCall();

//                     break;
//                 }
//                 case IL.Opcode.Callvirt: {
//                     if(!ilmethod) throw new Error(`couldnt find method ${instruction.operand}`);

//                     console.log(this.memory)
//                     console.log(this.vtable)

//                     let address = this.memory.getInt32(stackTop.evaluationStackAddress + (stackTop.evaluationStackLength - ilmethod.parameterLength) * 4);
//                     let typeId = this.memory.getInt32(address);

//                     console.log(instruction.operand)

//                     ilmethod = this.vtable[instruction.operand as string][typeId]

//                     handleCall();

//                     break;
//                 }
//                 case IL.Opcode.Ret: {
//                     let exitingMethod = stackTop.method;
//                     let returnValue = this.memory.getInt32(stackTop.evaluationStackAddress); //idk how to handle this properly

//                     this.memory.free(stackTop.localsAddress);
//                     this.memory.free(stackTop.evaluationStackAddress);
//                     this.memory.free(stackTop.argumentsAddress);

//                     this.stack.pop();

//                     assignStackTop();

//                     for(let i = 0; i < exitingMethod.parameterLength; i++) {
//                         stackTop.evaluationStackLength--;

//                         this.memory.setInt32(stackTop.evaluationStackAddress + stackTop.evaluationStackLength * 4, 0);
//                     }

//                     push(returnValue);

//                     break;
//                 }
//             }

//             if(!dontIncrementCounter) stackTop.counter++;

//             return true;
//         }
        
//         run() {
//             while(this.step()) {
//                 yourtakingtoolong();

//                 continue;
//             }
//         }
//     }
// }
// //#endregion Emulator

// const breakpoints = new Set<IL.Instruction>();

// function breakpoint(instruction: IL.Instruction) {
//     breakpoints.add(instruction);

//     return instruction;
// }

// var program = create(new IL.Program(), obj => {
//     obj.classes = [
//         //public class Object {
//         create(new IL.Class(), obj => {
//             obj.size = 4
//             obj.attributes = [IL.Attribute.Public]
//             obj.name = "Object"
//             obj.fields = [
//                 //public Int32 Type;
//                 create(new IL.Field(), obj => {
//                     obj.offset = 0
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Instance]
//                     obj.type = "Int32"
//                     obj.name = "Type"
//                 })
//             ];
//             obj.methods = [
//                 //public Object() {
//                 create(new IL.Method(), obj => {
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Instance]
//                     obj.returnType = "void"
//                     obj.name = ".ctor"
//                     obj.parameters = []
//                     obj.locals = []
//                     obj.body = [
//                         //this.type = 0x1234567
//                         // new IL.Instruction(IL.Opcode.Ldarg, 0),
//                         // new IL.Instruction(IL.Opcode.Ldc_i4, 0xaaaaaaaa),
//                         // new IL.Instruction(IL.Opcode.Stfld, "Int32 Object.Type"),
//                         new IL.Instruction(IL.Opcode.Ldarg, 0),
//                         new IL.Instruction(IL.Opcode.Call, "void Console::WriteLine(Int32)"),

//                         //return;
//                         new IL.Instruction(IL.Opcode.Ret)
//                     ]
//                 })
//             ]
//         }),

//         //public class String {
//         create(new IL.Class(), obj => {
//             obj.size = -1
//             obj.extends = "Object"
//             obj.attributes = [IL.Attribute.Public]
//             obj.name = "String"
//             obj.fields = [
//                 //public Int32 Length;
//                 create(new IL.Field(), obj => {
//                     obj.offset = 0
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Instance]
//                     obj.type = "Int32"
//                     obj.name = "Length"
//                 })
//             ];
//             obj.methods = [
//                 //public static Concat(String str0, String str1) {
//                 create(new IL.Method(), obj => {
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Static]
//                     obj.returnType = "String"
//                     obj.name = "Concat"
//                     obj.parameters = [
//                         create(new IL.Parameter(), obj => {
//                             obj.index = 0;
//                             obj.type = "String"
//                             obj.name = "str0"
//                         }),
//                         create(new IL.Parameter(), obj => {
//                             obj.index = 1;
//                             obj.type = "String"
//                             obj.name = "str1"
//                         })
//                     ]
//                     obj.locals = []
//                     obj.body = []
//                 })
//             ]
//         }),

//         //public class Console
//         create(new IL.Class(), obj => {
//             obj.size = 0
//             obj.name = "Console"
//             obj.fields = [];

//             let writeLine = (type: string) => {
//                 return create(new IL.Method(), obj => {
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Static]
//                     obj.returnType = "void"
//                     obj.name = "WriteLine"
//                     obj.parameters = [
//                         create(new IL.Parameter(), obj => {
//                             obj.index = 0
//                             obj.type = type
//                             obj.name = "value"
//                         })
//                     ]
//                     obj.locals = []
//                     obj.body = [] //internal
//                 })
//             }

//             obj.methods = [
//                 writeLine("Int32"),
//                 writeLine("String"),
//             ]
//         }),

//         //public class Vehicle {
//         create(new IL.Class(), obj => {
//             obj.extends = "Object"
//             obj.size = 4 + 4
//             obj.name = "Vehicle"
//             obj.fields = [
//                 //public Int32 Speed;
//                 create(new IL.Field(), obj => {
//                     obj.offset = 4
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Instance]
//                     obj.type = "Int32"
//                     obj.name = "Speed"
//                 })
//             ];
//             obj.methods = [
//                 //public Vehicle(Int32 speed) {
//                 create(new IL.Method(), obj => {
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Instance]
//                     obj.returnType = "void"
//                     obj.name = ".ctor"
//                     obj.parameters = [
//                         create(new IL.Parameter(), obj => {
//                             obj.index = 0
//                             obj.type = "Int32"
//                             obj.name = "speed"
//                         })
//                     ]
//                     obj.locals = []
//                     obj.body = [
//                         //base();
//                         new IL.Instruction(IL.Opcode.Ldarg, 0),
//                         new IL.Instruction(IL.Opcode.Call, "void Object::.ctor()"),

//                         //this.Speed = speed;
//                         new IL.Instruction(IL.Opcode.Ldarg, 0),
//                         new IL.Instruction(IL.Opcode.Ldarg, 1),
//                         new IL.Instruction(IL.Opcode.Stfld, "Int32 Vehicle.Speed"),

//                         //return;
//                         new IL.Instruction(IL.Opcode.Ret)
//                     ]
//                 }),

//                 //public virtual Int32 Bingle(Int32 value) {
//                 create(new IL.Method(), obj => {
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Instance, IL.Attribute.Virtual]
//                     obj.returnType = "Int32"
//                     obj.name = "Bingle"
//                     obj.parameters = [
//                         create(new IL.Parameter(), obj => {
//                             obj.index = 0
//                             obj.type = "Int32"
//                             obj.name = "value"
//                         })
//                     ]
//                     obj.locals = []
//                     obj.body = [
//                         //return this.Speed * value;
//                         new IL.Instruction(IL.Opcode.Ldarg, 0),
//                         new IL.Instruction(IL.Opcode.Ldfld, "Int32 Vehicle.Speed"),
//                         new IL.Instruction(IL.Opcode.Ldarg, 1),
//                         new IL.Instruction(IL.Opcode.Mul),
//                         new IL.Instruction(IL.Opcode.Ret)
//                     ]
//                 })
//             ]
//         }),

//         //public class Car {
//         create(new IL.Class(), obj => {
//             obj.extends = "Vehicle"
//             obj.size = 4 + 4
//             obj.name = "Car"
//             obj.fields = [];
//             obj.methods = [
//                 //public Car(Int32 year) {
//                 create(new IL.Method(), obj => {
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Instance]
//                     obj.returnType = "void"
//                     obj.name = ".ctor"
//                     obj.parameters = [
//                         create(new IL.Parameter(), obj => {
//                             obj.index = 0
//                             obj.type = "Int32"
//                             obj.name = "speed"
//                         })
//                     ]
//                     obj.locals = []
//                     obj.body = [
//                         //base(speed);
//                         new IL.Instruction(IL.Opcode.Ldarg, 0),
//                         new IL.Instruction(IL.Opcode.Ldarg, 1),
//                         new IL.Instruction(IL.Opcode.Call, "void Vehicle::.ctor(Int32)"),

//                         //return;
//                         new IL.Instruction(IL.Opcode.Ret)
//                     ]
//                 }),

//                 //public override Int32 Bingle(Int32 value) {
//                 create(new IL.Method(), obj => {
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Instance, IL.Attribute.Virtual]
//                     obj.returnType = "Int32"
//                     obj.name = "Bingle"
//                     obj.parameters = [
//                         create(new IL.Parameter(), obj => {
//                             obj.index = 0
//                             obj.type = "Int32"
//                             obj.name = "value"
//                         })
//                     ]
//                     obj.locals = []
//                     obj.body = [
//                         //return base.Bingle(value) + 1;
//                         new IL.Instruction(IL.Opcode.Ldarg, 0),
//                         new IL.Instruction(IL.Opcode.Ldarg, 1),
//                         new IL.Instruction(IL.Opcode.Call, "Int32 Vehicle::Bingle(Int32)"),
//                         new IL.Instruction(IL.Opcode.Ldc_i4, 1),
//                         new IL.Instruction(IL.Opcode.Add),
//                         new IL.Instruction(IL.Opcode.Ret)
//                     ]
//                 })
//             ]
//         }),

//         //public class Program {
//         create(new IL.Class(), obj => {
//             obj.attributes = [IL.Attribute.Public]
//             obj.name = "Program"
//             obj.methods = [
//                 //public static void Main() {
//                 create(new IL.Method(), obj => {
//                     obj.attributes = [IL.Attribute.Public, IL.Attribute.Static]
//                     obj.returnType = "void"
//                     obj.name = "Main"
//                     obj.locals = [
//                         create(new IL.Local(), obj => {
//                             obj.name = "car"
//                             obj.index = 0
//                             obj.type = "Vehicle"
//                         }),
//                     ]
//                     obj.body = [
//                         //Vehicle car = new Car(8);
//                         new IL.Instruction(IL.Opcode.Ldc_i4, 8),
//                         new IL.Instruction(IL.Opcode.Newobj, "void Car::.ctor(Int32)"),
//                         new IL.Instruction(IL.Opcode.Stloc, 0),

//                         //Console.WriteLine(car.Bingle(2))
//                         new IL.Instruction(IL.Opcode.Ldloc, 0),
//                         new IL.Instruction(IL.Opcode.Ldc_i4, 2),
//                         new IL.Instruction(IL.Opcode.Callvirt, "Int32 Vehicle::Bingle(Int32)"),
//                         new IL.Instruction(IL.Opcode.Call, "void Console::WriteLine(Int32)"),
//                     ]
//                 })
//             ]
//         })
//     ]
// });

// var tokenized = stringToTokens(`
// public static class Bello extends bongle, zongle {
//     Int32 fieldbuh = 6 + 2;

//     Int32 Bingle(Int32 buh, Int32 ouh) {
//         if(true) {
//             return 5;
//         } else if(true) {

//         } else {

//         }

//         return true;
//     }
// }
// `);
// // var tokenized = stringToTokens(`
// // public static class Bello {
// //     Int32 fieldbuh;
// // }
// // `);
// // var tokenized = stringToTokens(`bingle + zingle("yes", 5, !false + !true)[i][5].3[3];`);
// // var tokenized = stringToTokens(`bingle[5];`);
// // var tokenized = stringToTokens(`(bingle + 1)[2,3];`);
// // var tokenized = stringToTokens(`(5 - 2) + bingle[5, 4];`);
// // var tree = SyntaxAnalyzer.SyntaxTree.fromTokens(tokenized);
// // var il = IntermediateCodeGenerator.expressionToIL(expression);

// // console.log(tokenized)
// try {
//     console.log(SyntaxAnalyzer.SyntaxTree.fromTokens(tokenized, 0))
// } catch(e) {
//     console.error((e as Error).stack)
// }
// // console.log(...il);


// // const emulator = new Emulator.Emulator(256, program);

// // try {
// //     emulator.run()

// //     console.log(...emulator.stack)
// //     console.log(emulator.memory)
// // } catch(e) {
// //     // console.log(emulator.stack.at(-1)?.method.name)
// //     // console.log(emulator.stack.at(-1)?.method.body[emulator.stack.at(-1)?.counter ?? -1])

// //     console.error((e as Error).stack)
// // }