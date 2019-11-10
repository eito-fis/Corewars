
//comand parent classe
class Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
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
		this.memory = memory
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
				return (new_index + this.memory[new_index].b) % this.memory_size
				break
			case '*': case '{': case '}':		
                var new_index = (this.index + v) % this.memory_size
				return (new_index + this.memory[new_index].a) % this.memory_size
				break
		}
	}


	pre(v, mod){
		if (mod=='<'){
            if (this.memory[this.index + v].b == 0) {
                this.memory[this.index+v].b = this.memory_size
            }
            else {
                this.memory[this.index+v].b -= 1
            }
		}
		if (mod=='{'){
            if (this.memory[this.index + v].a == 0) {
                this.memory[this.index+v].a = this.memory_size
            }
            else {
                this.memory[this.index+v].a -= 1
            }
		}
	}

	post(v,mod){
		if (mod=='}'){
			this.memory[this.index+v].a = (this.memory[this.index + v].a + 1) % this.memory_size
		}
		if (mod=='>'){
			this.memory[this.index+v].b = (this.memory[this.index + v].b + 1) % this.memory_size
		}
	}

	call(processes, process_index, gen){

		this.pre(this.a, this.a_am)
		this.pre(this.b, this.b_am)

		this._call(processes, process_index, gen)
		
		this.post(this.a, this.a_am)
		this.post(this.b, this.b_am)
    }

	_call(processes, process_index, gen){}
}

//add
class Add extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

    _add(source, target){
        var ret = target + source
        return ret % this.memory_size
    }

	_call(processes, process_index){
        var source = this.get_true_index(this.a, this.a_am)
        var dest = this.get_true_index(this.b, this.b_bm)
        switch(this.mod){
            case "A":
                this.memory[dest].a = this._add(this.memory[source].a, this.memory[dest].a)
                break
            case "B":
                this.memory[dest].b = this._add(this.memory[source].b, this.memory[dest].b)
                break
            case "AB":
                this.memory[dest].b = this._add(this.memory[source].a, this.memory[dest].b)
                break
            case "BA":
                this.memory[dest].a = this._add(this.memory[source].b, this.memory[dest].a)
                break
            case "F": case "I":
                this.memory[dest].a = this._add(this.memory[source].a, this.memory[dest].a)
                this.memory[dest].b = this._add(this.memory[source].b, this.memory[dest].b)
                break
            case "X":
                this.memory[dest].a = this._add(this.memory[source].b, this.memory[dest].a)
                this.memory[dest].b = this._add(this.memory[source].a, this.memory[dest].b)
                break
        }
        processes[process_index] = (processes[process_index] + 1) % this.memory_size 
	}
}

//dat
class Dat extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

	_call(processes, process_index, gen){
		processes.splice(process_index,1)
	}
}

//div
class Div extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
        this._flag = false
	}

    _div(source, target, processes, process_index){
        if (source == 0 && !this._flag) {
            processes.splice(process_index,1)
            this._flag = true
            return target
        }
        return (target / source) >> 0
    }

	_call(processes, process_index){
        var source = this.get_true_index(this.a, this.a_am)
        var dest = this.get_true_index(this.b, this.b_bm)
        switch(this.mod){
            case "A":
                this.memory[dest].a = this._div(this.memory[source].a, this.memory[dest].a, processes, process_index)
                break
            case "B":
                this.memory[dest].b = this._div(this.memory[source].b, this.memory[dest].b, processes, process_index)
                break
            case "AB":
                this.memory[dest].b = this._div(this.memory[source].a, this.memory[dest].b, processes, process_index)
                break
            case "BA":
                this.memory[dest].a = this._div(this.memory[source].b, this.memory[dest].a, processes, process_index)
                break
            case "F": case "I":
                this.memory[dest].a = this._div(this.memory[source].a, this.memory[dest].a, processes, process_index)
                this.memory[dest].b = this._div(this.memory[source].b, this.memory[dest].b, processes, process_index)
                break
            case "X":
                this.memory[dest].a = this._div(this.memory[source].b, this.memory[dest].a, processes, process_index)
                this.memory[dest].b = this._div(this.memory[source].a, this.memory[dest].b, processes, process_index)
                break
        }
        if (!this._flag) {
            processes[process_index] = (processes[process_index] + 1) % this.memory_size 
        }
        this._flag = false
	}
}

//djn
class Djn extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

    _cond(cond, processes, process_index) {
        if (cond) {
            processes[process_index] = destination_index
        }
        else {
            processes[process_index] = (processes[process_index] + 1) % this.memory_size 	
        }
    }

	_call(processes, process_index, gen){
		var destination_index = this.get_true_index(this.a, this.a_am)
		var check = this.get_true_index(this.b, this.b_am)
		switch(this.mod){
			case 'A': case 'BA':
				this.memory[check].a -= 1
				this._cond((this.memory[check].a != 0), processes, process_index)
				break
			case 'B': case 'AB':
				this.memory[check].b -= 1
				this._cond((this.memory[check].b != 0), processes, process_index)
				break
			case 'I': case 'X': case 'F':
				this.memory[check].a -= 1
				this.memory[check].b -= 1
				this._cond((this.memory[check].a != 0 || this.memory[check].b != 0), processes, process_index)
				break
		}
		
	}
}

//jmn
class Jmn extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

    _cond(cond, processes, process_index) {
        if (cond) {
            processes[process_index] = destination_index
        }
        else {
            processes[process_index] = (processes[process_index] + 1) % this.memory_size 	
        }
    }

	_call(processes, process_index, gen){
		var destination_index = this.get_true_index(this.a, this.a_am)
		var check = this.get_true_index(this.b, this.b_am)
		switch(this.mod){
			case 'A': case 'BA':
				this._cond((this.memory[check].a != 0), processes, process_index)
				break
			case 'B': case 'AB':
				this._cond((this.memory[check].b != 0), processes, process_index)
				break
			case 'I': case 'X': case 'F':
				this._cond((this.memory[check].a != 0 || this.memory[check].b != 0), processes, process_index)
				break
		}
		
	}
}

//jmp
class Jmp extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

	_call(processes, process_index, gen){
		var destination_index = this.get_true_index(this.a, this.a_am)
		processes[process_index] = destination_index
	}
}

//jmz
class Jmz extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

    _cond(cond, processes, process_index) {
        if (cond) {
            processes[process_index] = destination_index
        }
        else {
            processes[process_index] = (processes[process_index] + 1) % this.memory_size 	
        }
    }

	_call(processes, process_index, gen){
		var destination_index = this.get_true_index(this.a, this.a_am)
		var check = this.get_true_index(this.b, this.b_am)
		switch(this.mod){
			case 'A': case 'BA':
				this._cond((this.memory[check].a == 0), processes, process_index)
				break
			case 'B': case 'AB':
				this._cond((this.memory[check].b == 0), processes, process_index)
				break
			case 'I': case 'X': case 'F':
				this._cond((this.memory[check].a == 0 && this.memory[check].b == 0), processes, process_index)
				break
		}
		
	}
}

//mod
class Mod extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
        this._flag = false
	}

    _mod(source, target, processes, process_index){
        if (source == 0 && !this._flag) {
            processes.splice(process_index,1)
            this._flag = true
            return target
        }
        return target % source
    }

	_call(processes, process_index){
        var source = this.get_true_index(this.a, this.a_am)
        var dest = this.get_true_index(this.b, this.b_bm)
        switch(this.mod){
            case "A":
                this.memory[dest].a = this._mod(this.memory[source].a, this.memory[dest].a, processes, process_index)
                break
            case "B":
                this.memory[dest].b = this._mod(this.memory[source].b, this.memory[dest].b, processes, process_index)
                break
            case "AB":
                this.memory[dest].b = this._mod(this.memory[source].a, this.memory[dest].b, processes, process_index)
                break
            case "BA":
                this.memory[dest].a = this._mod(this.memory[source].b, this.memory[dest].a, processes, process_index)
                break
            case "F": case "I":
                this.memory[dest].a = this._mod(this.memory[source].a, this.memory[dest].a, processes, process_index)
                this.memory[dest].b = this._mod(this.memory[source].b, this.memory[dest].b, processes, process_index)
                break
            case "X":
                this.memory[dest].a = this._mod(this.memory[source].b, this.memory[dest].a, processes, process_index)
                this.memory[dest].b = this._mod(this.memory[source].a, this.memory[dest].b, processes, process_index)
                break
        }
        if (!this._flag) {
            processes[process_index] = (processes[process_index] + 1) % this.memory_size 
        }
        this._flag = false
	}
}

//mov
class Mov extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

	_call(processes, process_index, gen){
		var source = this.get_true_index(this.a, this.a_am)
		var destination = this.get_true_index(this.b, this.b_am)
		switch(this.mod){
			case 'A':
				//moves the A-field of the source into the A-field of the destination
				this.memory[destination].a = this.memory[source].a 
				break
			case 'B':
				this.memory[destination].b = this.memory[source].b 
				break
			case 'AB':
				this.memory[destination].b = this.memory[source].a 
				break
			case 'BA':
				this.memory[destination].a = this.memory[source].b
				break
			case 'I':
                var orig = this.memory[source]
				this.memory[destination] = Object.assign(Object.create(Object.getPrototypeOf(orig)), orig)
                this.memory[destination].index = destination
				break
			case 'F':
				this.memory[destination].a = this.memory[source].a 
				this.memory[destination].b = this.memory[source].b
				break
			case 'X':
				this.memory[destination].a = this.memory[source].b 
				this.memory[destination].b = this.memory[source].a
				break
		}
		// incrementing by one, after the move
		processes[process_index] = (processes[process_index] + 1) % this.memory_size 

	}
}

//mul
class Mul extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

    _mul(source, target){
        var ret = target * source
        return ret % this.memory_size
    }

	_call(processes, process_index){
        var source = this.get_true_index(this.a, this.a_am)
        var dest = this.get_true_index(this.b, this.b_bm)
        switch(this.mod){
            case "A":
                this.memory[dest].a = this._mul(this.memory[source].a, this.memory[dest].a)
                break
            case "B":
                this.memory[dest].b = this._mul(this.memory[source].b, this.memory[dest].b)
                break
            case "AB":
                this.memory[dest].b = this._mul(this.memory[source].a, this.memory[dest].b)
                break
            case "BA":
                this.memory[dest].a = this._mul(this.memory[source].b, this.memory[dest].a)
                break
            case "F": case "I":
                this.memory[dest].a = this._mul(this.memory[source].a, this.memory[dest].a)
                this.memory[dest].b = this._mul(this.memory[source].b, this.memory[dest].b)
                break
            case "X":
                this.memory[dest].a = this._mul(this.memory[source].b, this.memory[dest].a)
                this.memory[dest].b = this._mul(this.memory[source].a, this.memory[dest].b)
                break
        }
        processes[process_index] = (processes[process_index] + 1) % this.memory_size 
	}
}

//seq
class Seq extends Command {
    constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
        super(a, b, a_am, b_am, mod, memory, memory_size, index)
    }

    _equal() {
        var len = arguments.length;
        for (var i = 1; i< len; i++) {
            // a == b && b == c && c == d
            if (arguments[i] === null || arguments[i] !== arguments[i-1])
                return false;
        }
        return true;
    }

    _compare(cond, processes, process_index) {
        if (cond){
            processes[process_index] = (processes[process_index] + 2) % this.memory_size
        }
        else {
            processes[process_index] = (processes[process_index] + 1) % this.memory_size
        }
    }

    _call(processes, process_index, gen){
        var acheck = this.get_true_index(this.a, this.a_am)
        var bcheck = this.get_true_index(this.b, this.b_am)
        switch(this.mod){
            case 'A': 
                this._compare((this.memory[acheck].a == this.memory[bcheck].a), processes_process, index)
                break
            case 'B': 
                this._compare((this.memory[acheck].b == this.memory[bcheck].b), processes_process, index)
                break
            case 'AB':
                this._compare((this.memory[acheck].a == this.memory[bcheck].b), processes_process, index)
                break
            case 'BA':
                this._compare((this.memory[acheck].b == this.memory[bcheck].a), processes_process, index)
                break
            case 'I': case 'X': case 'F':
                this._compare(this._equal(this.memory[acheck].a, this.memory[acheck].b, this.memory[bcheck].a, this.memory[bcheck].b), processes, process_index)
                break
        }

    }
}

//slt
class Slt extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

	_compare(cond, processes, process_index) {
        if (cond){
            processes[process_index] = (processes[process_index] + 2) % this.memory_size
        }
        else {
            processes[process_index] = (processes[process_index] + 1) % this.memory_size
        }
    }

	_call(processes, process_index, gen){
		var acheck = this.get_true_index(this.a, this.a_am)
		var bcheck = this.get_true_index(this.b, this.b_am)
		switch(this.mod){
			case 'A': 
				this._compare(this.memory[acheck].a < this.memory[bcheck].a, processes, process_index)
				break
			case 'B': 
				this._compare(this.memory[acheck].b < this.memory[bcheck].b, processes, process_index)
				break
			case 'AB':
				this._compare(this.memory[acheck].a < this.memory[bcheck].b, processes, process_index)
				break
			case 'BA':
				this._compare(this.memory[acheck].b < this.memory[bcheck].a, processes, process_index)
				break
			case 'I': case 'X': case 'F':
				console.log('incorrect instruction modifier used for SLT instruction')
				processes[process_index] = (processes[process_index] + 1) % this.memory_size
				break
		}
		
	}
}

//sne
class Sne extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

    _equal() {
        var len = arguments.length;
        for (var i = 1; i< len; i++) {
            if (arguments[i] === null || arguments[i] !== arguments[i-1])
                return true;
        }
        return false;
    }

    _compare(cond, processes, process_index) {
        if (cond){
            processes[process_index] = (processes[process_index] + 2) % this.memory_size
        }
        else {
            processes[process_index] = (processes[process_index] + 1) % this.memory_size
        }
    }
        
	_call(processes, process_index, gen){
		var acheck = this.get_true_index(this.a, this.a_am)
		var bcheck = this.get_true_index(this.b, this.b_am)
		switch(this.mod){
			case 'A': 
				this._compare(this.memory[acheck].a != this.memory[bcheck].a, processes, process_index)
				break
			case 'B': 
				this._compare(this.memory[acheck].b != this.memory[bcheck].b, processes, process_index)
				break
			case 'AB':
				this._compare(this.memory[acheck].a != this.memory[bcheck].b, processes, process_index)
				break
			case 'BA':
				this._compare(this.memory[acheck].b != this.memory[bcheck].b, processes, process_index)
				break
			case 'I': case 'X': case 'F':
                this._compare(this._equal(this.memory[acheck].a, this.memory[acheck].b, this.memory[bcheck].a, this.memory[bcheck].b), processes, process_index)
				break
		}
		
	}
}

//spl
class Spl extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

	_call(processes, process_index, gen){
		// new branch
		var destination_index = this.get_true_index(this.a, this.a_am)
		processes.splice(process_index+1,0, destination_index)
		processes[process_index] = (processes[process_index] + 1) % this.memory_size
		// continue on old shit
		gen.next()
	}
}

//sub
class Sub extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size, index){
		super(a, b, a_am, b_am, mod, memory, memory_size, index)
	}

    _sub(source, target){
        var ret = target - source
        if (ret < 0) {
            ret += this.memory_size
        }
        return ret
    }

	_call(processes, process_index){
        var source = this.get_true_index(this.a, this.a_am)
        var dest = this.get_true_index(this.b, this.b_bm)
        switch(this.mod){
            case "A":
                this.memory[dest].a = this._sub(this.memory[source].a, this.memory[dest].a)
                break
            case "B":
                this.memory[dest].b = this._sub(this.memory[source].b, this.memory[dest].b)
                break
            case "AB":
                this.memory[dest].b = this._sub(this.memory[source].a, this.memory[dest].b)
                break
            case "BA":
                this.memory[dest].a = this._sub(this.memory[source].b, this.memory[dest].a)
                break
            case "F": case "I":
                this.memory[dest].a = this._sub(this.memory[source].a, this.memory[dest].a)
                this.memory[dest].b = this._sub(this.memory[source].b, this.memory[dest].b)
                break
            case "X":
                this.memory[dest].a = this._sub(this.memory[source].b, this.memory[dest].a)
                this.memory[dest].b = this._sub(this.memory[source].a, this.memory[dest].b)
                break

        processes[process_index] = (processes[process_index] + 1) % this.memory_size 
        }
    }
}

function* gen(processes) {
    while (true) {
        for ([index, value] of processes.entries()) {
            yield [processes, index]
        }
    }
}

function init(memory_size) {
    memory = []
    for (i = 0; i < memory_size; i++) {
        memory.push(new Dat(0, 0, "$", "$", "", memory, memory_size, i))
    }
    return memory
}

function set_code(memory, code) {
    start = Math.floor(Math.random() * (memory.length - 1))
    for (i = 0; i < code.length; i++) {
        address = (start + i) % memory.length
        memory[address] = code[i]
        code[i].index = address
    }
    return start
}

function make_players(memory, code_list) {
    players = []
    for (c of code_list) {
        start = set_code(memory, c)
        players.push(gen([start]))
    }
    return players
}

function run(memory, players, game_length) {
    for (i = 0; i < game_length; i++) {
        // print(memory)
        console.log(memory)
        for (p of players) {
            [current_list, index] = p.next().value
            address = current_list[index]

            memory[address].call(current_list, index, p)
        }
    }
    print(memory)
}

function print(memory) {
    pretty_print = []
    for (m of memory) {
        if (m instanceof Mov) {
            pretty_print.push(1)
        }
        else {
            pretty_print.push(0)
        }
    }
    row_length = 10

    process.stdout.write("[")
    for (i = 1; i <= pretty_print.length; i++) {
        process.stdout.write(String(pretty_print[i - 1]) + ", ")
        if (i % 10 == 0) {
            process.stdout.write("]")
            console.log()
            process.stdout.write("[")
        }
    }
    process.stdout.write("]")
}

memory_size = 100
memory = init(memory_size)
code = [[new Mov(0, 1, "$", "$", "I", memory, memory_size, 0)]]
all_players = make_players(memory, code)
run(memory, all_players, 50)
