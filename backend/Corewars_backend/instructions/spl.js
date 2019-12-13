//spl


import Command from '../command_class'


export class Spl extends Command {
	constructor(a, b, a_am, b_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
	}

	_call(processes, process_index, gen){
		// new branch
		var destination_index = this.get_true_index(a, a_am)
		processes.splice(process_index+1,0, destination_index)
		processes[process_index] += 1
		// continue on old shit
		gen.next()
	}
}


