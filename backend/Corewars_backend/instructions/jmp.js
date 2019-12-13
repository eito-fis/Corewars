//jmp



import Command from '../command_class'


export class Jmp extends Command {
	constructor(a, b, a_am, b_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
	}

	_call(processes, process_index, gen){
		var destination_index = this.get_true_index(a, a_am)
		processes[process_index] = destination_index
	}
}


//				this.memory_buffer[destination].b = this.memory_buffer[source].a
