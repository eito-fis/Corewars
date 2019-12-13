//jmn

import Command from '../command_class'


export class Jmn extends Command {
	constructor(a, b, a_am, b_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
	}

    _cond(cond, processes, process_index) {
        if (cond) {
            processes[process_index] = destination_index
        }
        else {
            processes[process_index] += 1 	
        }
    }

	_call(processes, process_index, gen){
		var destination_index = this.get_true_index(a, a_am)
		var check = this.get_true_index(b, b_am)
		switch(this.mod){
			case 'A': case 'BA':
				this._cond((this.memory_buffer[check].a != 0), processes, process_index)
				break
			case 'B': case 'AB':
				this._cond((this.memory_buffer[check].b != 0), processes, process_index)
				break
			case 'I': case 'X': case 'F':
				this._cond((this.memory_buffer[check].a != 0 || this.memory_buffer[check].b != 0), processes, process_index)
				break
		}
		
	}
}
