//add

import Command from '../command_class'


export class Add extends Command {
	constructor(a, b, a_am, a_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
	}

    _add(source, target){
        var ret = target + source
        return ret % this.memory_size
    }

	_call(processes, process_index){
        var source = this.get_true_index(this.a, this.a_am)
        var dest = this.get_true_index(this.b, this.b_bm)
        switch(this.mod){
            case "A":
                this.memory_buffer[dest].a = this._add(this.memory_buffer[source].a, this.memory_buffer[dest].a)
                break
            case "B":
                this.memory_buffer[dest].b = this._add(this.memory_buffer[source].b, this.memory_buffer[dest].b)
                break
            case "AB":
                this.memory_buffer[dest].b = this._add(this.memory_buffer[source].a, this.memory_buffer[dest].b)
                break
            case "BA":
                this.memory_buffer[dest].a = this._add(this.memory_buffer[source].b, this.memory_buffer[dest].a)
                break
            case "F": case "I":
                this.memory_buffer[dest].a = this._add(this.memory_buffer[source].a, this.memory_buffer[dest].a)
                this.memory_buffer[dest].b = this._add(this.memory_buffer[source].b, this.memory_buffer[dest].b)
                break
            case "X":
                this.memory_buffer[dest].a = this._add(this.memory_buffer[source].b, this.memory_buffer[dest].a)
                this.memory_buffer[dest].b = this._add(this.memory_buffer[source].a, this.memory_buffer[dest].b)
                break
        }
        processes[process_index] += 1 
	}
}
