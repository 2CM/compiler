export class Memory<T extends ArrayBuffer = ArrayBuffer> extends DataView<T> {
    encoder: TextEncoder = new TextEncoder();
    decoder: TextDecoder = new TextDecoder();
    counter: number = 0;

    allocatedAddresses: Record<number, number> = {};

    constructor(size: number) {
        let buffer = new ArrayBuffer(size) as T;
        
        super(buffer);
    }

    allocate(length: number): number {
        if(this.counter + length > this.byteLength) throw new Error("out of memory. build that allocator");

        let address = this.counter;

        this.counter += length;

        this.allocatedAddresses[address] = length;

        return address;
    }
    
    free(address: number) {
        //todo: implement

        // console.log(address.toHexString())
        // console.log(this.allocatedAddresses[address]?.toHexString())

        for(let i = address; i < address + this.allocatedAddresses[address]; i++) {
            this.setInt8(i, 0)
        }
    }

    setString(byteOffset: number, value: string) {
        let encoded = this.encoder.encode(value);

        for(let i = 0; i < encoded.length; i++) {
            this.setInt8(byteOffset + i, encoded[i]);
        }
    }

    getString(byteOffset: number) {
        let length = this.getInt32(byteOffset + 4);

        return this.decoder.decode(this.buffer.slice(byteOffset + 8, byteOffset + length + 8));
    }

    toString() {
        let str = "\n      "

        //legend
        for(let j = 0; j < 16; j++) {
            str += j.toString(16).toUpperCase().padStart(2, "0")

            if(j < 15) str += "."
        }

        str += "\n"

        for(let i = 0; i < this.byteLength; i += 16) {
            //address
            str += i.toString(16).toUpperCase().padStart(4, "0") + "  "

            //hex value
            for(let j = 0; j < 16; j++) {
                str += this.getUint8(i + j).toString(16).toUpperCase().padStart(2, "0")

                if(j < 15) str += " "
            }

            str += "  "

            //char value
            for(let j = 0; j < 16; j++) {
                let byte = this.getUint8(i + j);

                str += byte == 0 ? "." : String.fromCharCode(byte);
            }

            str += "\n"
        }

        return str;
    }
}