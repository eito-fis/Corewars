//dat

import Command from '../command_class'


class Dat extends Command {
	constructor(a, b, a_am, a_am, mod, memory_buffer, index){
		super(a, b, a_am, a_am, mod, memory_buffer, index)
	}

	_call(processes, process_index){
		processes.splice(process_index,1)
	}
}