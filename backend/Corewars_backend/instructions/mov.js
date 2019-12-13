//mov


import Command from '../command_class'


export class Mov extends Command {
	constructor(a, b, a_am, b_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
	}

	_call(processes, process_index, gen){
		var source = this.get_true_index(a, a_am)
		var destination = this.get_true_index(b, b_am)
		switch(this.mod){
			case 'A':
				//moves the A-field of the source into the A-field of the destination
				this.memory_buffer[destination].a = this.memory_buffer[source].a 
				break
			case 'B':
				this.memory_buffer[destination].b = this.memory_buffer[source].b 
				break
			case 'AB':
				this.memory_buffer[destination].b = this.memory_buffer[source].a 
				break
			case 'BA':
				this.memory_buffer[destination].a = this.memory_buffer[source].b
				break
			case 'I':
				this.memory_buffer[destination] = this.memory_buffer[source]
				break
			case 'F':
				this.memory_buffer[destination].a = this.memory_buffer[source].a 
				this.memory_buffer[destination].b = this.memory_buffer[source].b
				break
			case 'X':
				this.memory_buffer[destination].a = this.memory_buffer[source].b 
				this.memory_buffer[destination].b = this.memory_buffer[source].a
				break
		}
		// incrementing by one, after the move
		processes[process_index] += 1 

	}
}
