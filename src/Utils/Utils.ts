export function create<T>(instance: T, callback: (obj: T) => void) {
    callback(instance);

    return instance;
}

// let log = document.getElementById("log") as HTMLElement;

export const indentationString = "│ ";

export const syntaxColors = {
    string: "#ce9178",
    number: "#b5cea8",
    boolean: "#4e94ce",
    value: "#9cdcfe",
    name: "#c586c0",
    type: "#3dc9b0",
    error: "#f14c4c", //what are you doing here
}

export function hexToRGB(hex: string): [number, number, number] {
    if(hex.startsWith("#")) hex = hex.slice(1);

    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
    ];
}

export function getAnsiColorCode(color: string) {
    let [r, g, b] = hexToRGB(color);

    return `\x1b[38;2;${r};${g};${b}m`
}

export function colorInfinite(str: any, color: string) {
    let colorAnsi = getAnsiColorCode(color);

    return colorAnsi + str;
}

export function color(str: any, color: string) {
    let resetAnsi = `\x1b[0m`

    return colorInfinite(str, color) + resetAnsi;
}

export function colorWithType(str: any) {
    return color(str, 
        typeof(str) == "string" ? syntaxColors.string :
        typeof(str) == "number" ? syntaxColors.number :
        !str || typeof(str) == "boolean" ? syntaxColors.boolean :
        syntaxColors.value
    )
}

let enumValues: Record<string, Record<string, any>> = {};
let ignoreInLoggings: Set<string> = new Set<string>();

export function enumValue(constructor: any, type: any) {
    return function(target: any, propertyKey: string) {
        if(!enumValues[constructor.name]) enumValues[constructor.name] = {};
        
        enumValues[constructor.name][propertyKey] = type;
    }
}

export function ignoreInLogging() {
    return function(target: any, propertyKey: string) {
        ignoreInLoggings.add(propertyKey);
    }
}

function betterToString(obj: any) {
    function getConstructorLabel(value: any) {
        return Array.isArray(value) ? 
            `[${colorWithType(value.length || "")}]` :
            color(value?.constructor?.name ?? "Object", syntaxColors.type)
    }

    function recur(obj: any, depth: number) {
        let str = "";
        let indentation = colorInfinite(indentationString.repeat(depth), "#404040");

        for(let key in obj) {
            // if(key == "tokenSource") continue;
            if(ignoreInLoggings.has(key)) continue;

            str += `\n${indentation}`;

            let value = obj[key];
            if(typeof(value) == "function") {
                value = value.call(obj, indentation);
            }

            if(!Array.isArray(obj)) str += color(`${key}: `, syntaxColors.value);

            let type = typeof(value ?? undefined);

            switch(type) {
                case "number":
                    let enumType = enumValues[obj?.constructor?.name]?.[key] ?? null;

                    if(enumType) {
                        str += color(enumType[value] as string, syntaxColors.type);
                        
                        break;
                    }
                case "boolean":
                case "undefined":
                    str += color(value?.toString() ?? "undefined", typeof(value) == "number" ? syntaxColors.number : syntaxColors.boolean);

                    break;
                case "string":
                    str += color(`"${value}"`, syntaxColors.string);

                    break;
                default:
                    str += getConstructorLabel(value);

                    if(value.inlineToString) {
                        str += " " + value.inlineToString();
                    } else {
                        str += recur(value, depth + 1);
                    }

                    break;
            }
        }

        return str;
    }

    return getConstructorLabel(obj) + recur(obj, 1);
}

const origConsoleLog = console.log;
// const origConsoleError = console.error;

// function appendConsole(str: string) {
//     let zelement = document.createElement("div");
//         zelement.innerHTML = str;

//     let br = document.createElement("br");

//     log.appendChild(document.createElement("hr"));
//     log.appendChild(zelement);

//     if(str.endsWith("\n")) {
//         log.appendChild(br);
//         br.scrollIntoView(false);
//     } else {
//         zelement.scrollIntoView(false);
//     }
// }

console.log = (...data: any) => {
    origConsoleLog(color("─".repeat(process.stdout.columns), "#404040"))

    origConsoleLog(data.map((item: any) => {
        let str: string = (item ?? "null").toString();

        if(str.startsWith("[object Object]")) str = betterToString(item);

        return str;
    }).join("\n"))
}

// console.error = (...data: any) => {
//     origConsoleError(color(data[0], syntaxColors.error))
// }

// (() => {
//     let orig = console.log;

//     console.log = function(...data: any[]) {
//         if(customLoggingClasses.has(data[0]?.constructor)) {
//             orig(data.toString());

//             return;
//         }

//         orig(...data);
//     }
// })();

const evilRegexCharacters = new Set(".*+?^/|".split(""));

export function cleanStringForRegex(str: string): string {
    return str.split("").map(char => (evilRegexCharacters.has(char) ? "\\" : "") + char).join("")
}

let yourtakingtootoo = 0;

export function yourtakingtoolong() {
    if(yourtakingtootoo > 10000) {
        let stack = new Error("YOUR TAKING TOO LONG").stack;

        throw new Error("YOUR TAKING TOO LONG: \n" + stack)
    }
    
    yourtakingtootoo++;
}

export function formatType(value: number, type: string) {
    return ["Int32"].includes(type) ? value.toHexString() : value.toHexString()
}

declare global {
    interface Number {
        toHexString: () => string;
    }
}

Number.prototype.toHexString = function() {
    return "0x" + this.toString(16);
}