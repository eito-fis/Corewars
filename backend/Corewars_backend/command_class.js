//comand parent classe


export class Command {
	constructor(a, b, a_am, b_am, mod, memory_buffer, memory_size, index){
        while (a < 0) {
            a += memory_size
        }
		this.a = a % memory_size
        while (b < 0) {
            b += memory_size
        }
		this.b = b % memory_size
		this.a_am = a_am
		this.b_am = b_am
		this.mod = mod
		this.memory_buffer = memory_buffer
		this.memory_size = memory_size
		this.index = index
	}

	get_true_index(v, mod) {
		switch(mod){
			case '#':
				return this.index
				break
			case '$' : 
				return (this.index + v) % this.memory_size
				break
			case '@': case '<': case '>':
                var new_index = (this.index + v) % this.memory_size
				return (new_index + this.memory_buffer[new_index].b) % this.memory_size
				break
			case '*': case '{': case '}':		
                var new_index = (this.index + v) % this.memory_size
				return (new_index + this.memory_buffer[new_index].a) % this.memory_size
				break
		}
	}


	pre(v, mod){
		if (mod=='<'){
            if (this.memory_buffer[this.index + v].b == 0) {
				this.memory_buffer[this.index + v].b = this.memory_size
			}
            else {
                this.memory_buffer[this.index+v].b -= 1
            }
		}
		if (mod=='{'){
            if (this.memory_buffer[this.index + v].a == 0) {
				this.memory_buffer[this.index + v].a = this.memory_size
			}
            else {
                this.memory_buffer[this.index+v].a -= 1
            }
		}
	}

	post(v,mod){
		if (mod=='}'){
			this.memory_buffer[this.index+v].a = (this.memory_buffer[this.index + v].a + 1) % this.memory_size
		}
		if (mod=='>'){
			this.memory_buffer[this.index+v].b = (this.memory_buffer[this.index + v].b + 1) % this.memory_size
		}
	}

	call(processes, process_index, gen){

		this.pre(this.a, this.a_am)
		this.pre(this.b, this.b_am)

		this._call(processes, process_index, gen)
		
		this.post(this.a, this.a_am)
		this.post(this.b, this.b_am)


	_call(processes, process_index, en){
			return null;
		}
	}
}
