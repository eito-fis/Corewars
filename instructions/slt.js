//slt

//THIS IS WRONG, CHECK FINAL CONDITIONAL! IT'S WRONG. 
import Command from '../command_class'


export class Slt extends Command {
	constructor(a, b, a_am, b_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
	}

	_call(processes, process_index, gen){
		var acheck = this.get_true_index(a, a_am)
		var bcheck = this.get_true_index(b, b_am)
		switch(this.mod){
			case 'A': 
				if (this.memory_buffer[acheck].a < this.memory_buffer[bcheck].a){
					processes[process_index] += 2
				}
				break
			case 'B': 
				if (this.memory_buffer[acheck].b < this.memory_buffer[bcheck].b){
					processes[process_index] += 2
				}
				break
			case 'AB':
				if (this.memory_buffer[acheck].a < this.memory_buffer[bcheck].b){
					processes[process_index] += 2
				}
				break
			case 'BA':
				if (this.memory_buffer[acheck].b < this.memory_buffer[bcheck].a){
					processes[process_index] += 2
				}
				break
			case 'I': case 'X': case 'F':
				console.log('incorrect instruction modifier used for SLT instruction')
				processes[process_index] += 1
				break
			default :
				processes[process_index] += 1 	
		}
		
	}
}

