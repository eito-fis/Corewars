//div

import Command from '../command_class'


export class Div extends Command {
	constructor(a, b, a_am, a_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
        this._flag = false
	}

    _div(source, target, processes, process_index){
        if (source == 0 && !this._flag) {
            processes.splice(process_index,1)
            this._flag = true
            return target
        }
        return (target / source) >> 0
    }

	_call(processes, process_index){
        var source = this.get_true_index(this.a, this.a_am)
        var dest = this.get_true_index(this.b, this.b_bm)
        switch(this.mod){
            case "A":
                this.memory_buffer[dest].a = this._div(this.memory_buffer[source].a, this.memory_buffer[dest].a, processes, process_index)
                break
            case "B":
                this.memory_buffer[dest].b = this._div(this.memory_buffer[source].b, this.memory_buffer[dest].b, processes, process_index)
                break
            case "AB":
                this.memory_buffer[dest].b = this._div(this.memory_buffer[source].a, this.memory_buffer[dest].b, processes, process_index)
                break
            case "BA":
                this.memory_buffer[dest].a = this._div(this.memory_buffer[source].b, this.memory_buffer[dest].a, processes, process_index)
                break
            case "F": case "I":
                this.memory_buffer[dest].a = this._div(this.memory_buffer[source].a, this.memory_buffer[dest].a, processes, process_index)
                this.memory_buffer[dest].b = this._div(this.memory_buffer[source].b, this.memory_buffer[dest].b, processes, process_index)
                break
            case "X":
                this.memory_buffer[dest].a = this._div(this.memory_buffer[source].b, this.memory_buffer[dest].a, processes, process_index)
                this.memory_buffer[dest].b = this._div(this.memory_buffer[source].a, this.memory_buffer[dest].b, processes, process_index)
                break
        }
        if (!this._flag) {
            processes[process_index] += 1 
        }
        this._flag = false
	}
}
