//comand parent classe


class Command {
	constructor(a, b, a_am, a_am, mod, memory_buffer, index){
		this.a = a
		this.b = b
		this.a_am = a_am
		this.b_am = b_am
		this.mod = mod
		this.memory_buffer = memory_buffer
		this.index = index
	}

	get_true_index(v, mod) {
		switch(mod){
			case '#':
				return this.index
				break
			case '$' : 
				return this.index + v
				break
			case '@': case '<': case '>':
				if (mod=='<'){
					this.memory_buffer[this.index+v].b -= 1
				}
				return this.memory_buffer[this.index+v].index + this.memory_buffer[this.index+v].b  
				break
			case '*': case '{': case '}':
				if (mod=='{'){
					this.memory_buffer[this.index+v].a -= 1
				}
				return this.memory_buffer[this.index+v].index + this.memory_buffer[this.index+v].a 
				break
		}

	}

	post(v,mod){
		if (mod=='}'){
			this.memory_buffer[this.index+v].a += 1
		}
		if (mod=='>'){
			this.memory_buffer[this.index+v].b += 1
		}
	}
	call(){
		this._call()
		this.post(this.a, this.a_am)
		this.post(this.b, this.b_am)


	_call(){}



}