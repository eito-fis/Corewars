//nop

import Command from '../command_class'


export class Nop extends Command {
	constructor(a, b, a_am, b_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
	}

	_call(processes, process_index, gen){
		processes[process_index] += 1 
	}
}