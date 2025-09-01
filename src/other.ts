// // namespace IntermediateCodeGenerator {
// //     function convertOperationToOpcode(operation: SyntaxAnalyzer.Operation): IL.Opcode {
// //         let map = {
// //             [SyntaxAnalyzer.Operation.Index]: IL.Opcode.Ldelem,
// //             [SyntaxAnalyzer.Operation.Multiply]: IL.Opcode.Mul,
// //             [SyntaxAnalyzer.Operation.Divide]: IL.Opcode.Div,
// //             [SyntaxAnalyzer.Operation.Add]: IL.Opcode.Add,
// //             [SyntaxAnalyzer.Operation.Subtract]: IL.Opcode.Sub,
// //         };

// //         return map[operation as keyof typeof map]; //typescrpt
// //     }

// //     export function expressionToIL(expression: SyntaxAnalyzer.Expression) {
// //         let body: IL.Instruction[] = [];

// //         function handleExpressionSide(side: SyntaxAnalyzer.Zingle) {
// //             if(side instanceof SyntaxAnalyzer.Expression) {
// //                 recur(side);
// //             } else if (side instanceof SyntaxAnalyzer.ExpressionList) {
// //                 for(let i in side.list) {
// //                     handleExpressionSide(side.list[i])
// //                 }
// //             } else {
// //                 if(side.type == TokenType.Identifier) {
// //                     body.push(new IL.Instruction(IL.Opcode.Ldfld, side.value));
// //                 } else if(side.type == TokenType.Literal) {
// //                     body.push(new IL.Instruction(IL.Opcode.Ldc_i4, side.value));
// //                 }
// //             }
// //         }

// //         function recur(expression: SyntaxAnalyzer.Expression) {
// //             switch(expression.operation) {
// //                 case SyntaxAnalyzer.Operation.Call:
// //                     if(!expression.right) throw new Error("what");

// //                     handleExpressionSide(expression.right);
// //                     body.push(new IL.Instruction(IL.Opcode.Call, (expression.left as Token).value));
// //                 break;
// //                 case SyntaxAnalyzer.Operation.Access:
// //                     handleExpressionSide(expression.left);
// //                     body.push(new IL.Instruction(IL.Opcode.Ldfld, (expression.right as Token).value));
// //                 break;
// //                 case SyntaxAnalyzer.Operation.Not:
// //                     handleExpressionSide(expression.left);
// //                     body.push(new IL.Instruction(IL.Opcode.Not));
// //                 break;
// //                 default:
// //                     if(!expression.right) throw new Error("what");

// //                     handleExpressionSide(expression.left);
// //                     handleExpressionSide(expression.right);
// //                     body.push(new IL.Instruction(convertOperationToOpcode(expression.operation)));
// //             }
// //         }

// //         recur(expression);

// //         return body;
// //     }

// //     export function syntaxTreeToIL(syntaxTree: SyntaxAnalyzer.SyntaxTree): IL.Program {
// //         return new IL.Program();
// //     }
// // }

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