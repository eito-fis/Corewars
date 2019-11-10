//sne

//THIS IS WRONG, CHECK FINAL CONDITIONAL! IT'S WRONG. 
import Command from '../command_class'


export class Sne extends Command {
	constructor(a, b, a_am, b_am, mod, memory_buffer, memory_size, index){
		super(a, b, a_am, b_am, mod, memory_buffer, memory_size, index)
	}

    _equal() {
        var len = arguments.length;
        for (var i = 1; i< len; i++) {
            if (arguments[i] === null || arguments[i] !== arguments[i-1])
                return false;
        }
        return true;
    }

	_call(processes, process_index, gen){
		var acheck = this.get_true_index(a, a_am)
		var bcheck = this.get_true_index(b, b_am)
		switch(this.mod){
			case 'A': 
				if (this.memory_buffer[acheck].a != this.memory_buffer[bcheck].a){
					processes[process_index] += 2
				}
				break
			case 'B': 
				if (this.memory_buffer[acheck].b != this.memory_buffer[bcheck].b){
					processes[process_index] += 2
				}
				break
			case 'AB':
				if (this.memory_buffer[acheck].a != this.memory_buffer[bcheck].b){
					processes[process_index] += 2
				}
				break
			case 'BA':
				if (this.memory_buffer[acheck].b != this.memory_buffer[bcheck].a){
					processes[process_index] += 2
				}
				break
			case 'I': case 'X': case 'F':
                if !(this._equal(this.memory_buffer[acheck].a, this.memory_buffer[acheck].b, this.memory_buffer[bcheck].a, this.memory_buffer[bcheck].b)) {
					processes[process_index] += 2
				}
				break
			default :
				processes[process_index] += 1 	
		}
		
	}
}

