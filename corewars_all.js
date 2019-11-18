
//Comand parent class
/*
Below is the command parent class. It includes the get_true_index, pre, post, and both call methods. 
Every single assembly instruction that we compiled into JS uses this command class as its parent, and 
shares these methods, which we use to alter the memory matrix as needed.  
*/
class Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
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
		this.index = 0
        this.player_id = -1
	}

    init(index, player_id) {
        this.index = index
        this.player_id = player_id
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


//All Instruction Child classes
/*
Below are the Instruction Child classes. These classes all include a constructor, and a _call method that takes 
in the process, process list, and gen. The _call is called in the command class, and is for the assembly-related 
purpose of each instruction command. The _call method, depending on the instruction, takes in instructional modifiers 
with a switch statement, and augments the memory matrix accordingly. 
*/


//add
class Add extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
	}

    _add(source, target){
        var ret = target + source
        return ret % this.memory_size
    }

	_call(processes, process_index){
        var source = this.get_true_index(this.a, this.a_am)
        var dest = this.get_true_index(this.b, this.b_am)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
	}

	_call(processes, process_index, gen){
		processes.splice(process_index,1)
	}
}

//div
class Div extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
	}

	_call(processes, process_index, gen){
		var destination_index = this.get_true_index(this.a, this.a_am)
		processes[process_index] = destination_index
	}
}

//jmz
class Jmz extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
    constructor(a, b, a_am, b_am, mod, memory, memory_size){
        super(a, b, a_am, b_am, mod, memory, memory_size)
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
                this._compare((this.memory[acheck].a == this.memory[bcheck].a), processes, process_index)
                break
            case 'B': 
                this._compare((this.memory[acheck].b == this.memory[bcheck].b), processes, process_index)
                break
            case 'AB':
                this._compare((this.memory[acheck].a == this.memory[bcheck].b), processes, process_index)
                break
            case 'BA':
                this._compare((this.memory[acheck].b == this.memory[bcheck].a), processes, process_index)
                break
            case 'I': case 'X': case 'F':
                this._compare(this._equal(this.memory[acheck].a, this.memory[acheck].b, this.memory[bcheck].a, this.memory[bcheck].b), processes, process_index)
                break
        }

    }
}

//slt
class Slt extends Command {
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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
	constructor(a, b, a_am, b_am, mod, memory, memory_size){
		super(a, b, a_am, b_am, mod, memory, memory_size)
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





// Setting up the matrix, running the simulation (game)
/*
Below we are setting up some functions that actually run the game, setup the memory matrix, initialize the players, their code, 
their processes, and visualize the game's results / outputs.  
*/


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

function set_code(memory, code, player_id) {
    start = Math.floor(Math.random() * (memory.length - 1))
    for (i = 0; i < code.length; i++) {
        address = (start + i) % memory.length
        memory[address] = code[i]
        code[i].init(address, player_id)
    }
    return start
}

function make_players(memory, code_list) {
    players = []
    for (var i = 0; i < code_list.length, i++) {
        start = set_code(memory, code_list[i], i)
        // Start new process where code was written
        players.push(gen([start]))
    }
    return players
}

function print(memory, row_length) {
    pretty_print = []
    for (m of memory) {
        if (m instanceof Mov)
        {
            pretty_print.push(1)
        } else if(m instanceof Jmp){
            pretty_print.push(2)
        } else if (m instanceof Add) {
            pretty_print.push(3)
        } else {pretty_print.push(0)}
    }

    process.stdout.write("[")
    for (i = 1; i <= pretty_print.length; i++) {
        process.stdout.write(String(pretty_print[i - 1]) + ", ")
        if ((i % row_length) == 0) {
            process.stdout.write("]")
            console.log()
            process.stdout.write("[")
        }
    }
    process.stdout.write("]")

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
        console.log(i)
    }
    print(memory, 10)
    console.log('completed')
}



//code execution 
/*
Here we execute the functions above, give player one an imp for starters, and create a memory array of size 100 
(80x smaller than officially.) Lots of debugging ahead.   
*/
memory_size = 100
memory = init(memory_size)
player1_code = [new Mov(0, 1, "$", "$", "I", memory, memory_size, 0)] // array of commands
player2_code = [new Add(4, 3, '#','$', 'AB', memory, memory_size, 17),
    new Mov(2, 2, "$", "@", "I", memory, memory_size, 18),
    new Jmp(-2, 0,'$', '$', '', memory, memory_size, 19 ),
    new Dat(0, 0, '$', '$', '', memory, memory_size, 20),]

code = [player1_code, player2_code]
all_players = make_players(memory, code)


console.log(all_players)


run(memory, all_players, 50)


//player 2 code
/*
ADD #4, 3        ; execution begins here
MOV 2, @2
JMP -2
DAT #0, #0
 */
