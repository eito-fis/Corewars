import Dat from "./instructions/dat.js"
import Nop from "./instructions/nop.js"
import Add from "./instructions/add.js"
import Sub from "./instructions/sub.js"
import Mul from "./instructions/mul.js"
import Div from "./instructions/div.js"
import Mod from "./instructions/mod.js"
import Mov from "./instructions/mov.js"
import Jmp from "./instructions/jmp.js"
import Jmz from "./instructions/jmz.js"
import Jmn from "./instructions/jmn.js"
import Djn from "./instructions/djn.js"
import Spl from "./instructions/spl.js"
import Seq from "./instructions/seq.js"
import Sne from "./instructions/sne.js"
import Slt from "./instructions/slt.js"

function* gen(processes) {
    while (true) {
        for ([index, value] of processes.entries()) {
            yield [processes, index]
        }
    }
}

function init(memory_size) {
    var memory_buffer = []
    for (var i = 0; i < memory_size; i++) {
        memory_buffer.append(new Dat(0, 0, "$", "$", "", memory_buffer, memory_size, i))
    }
    return memory_buffer
}

function set_code(memory_buffer, code) {
    var start = Math.floor(Math.random() * (memory_buffer.length - 1))
    for (var i = 0; i < code.length; i++) {
        var address = (start + i) % memory_buffer.length
        memory_buffer[address] = code[i]
        code[i].index = address
    }
    return start
}

function make_players(memory_buffer, code_list) {
    var players = []
    for (c of code_list) {
        var start = set_code(c)
        players.append(gen([start]))
    }
    return players
}

function run(memory_buffer, players, game_length) {
    console.log(memory_buffer)
    for (var i = 0; i < game_length; i++) {
        for (p of players) {
            [current_list, index] = p.next().value
            var address = current_list[index]

            memory[address].call(current_list, index, p)
        }
    }
    console.log(memory_buffer)
}

var memory_buffer = init(memory_size)
var code = [[Mov(0, 1, "$", "$", "I", memory_buffer, memory_size, 0)]]
var all_players = make_players(memory_buffer, code)
run(memory_buffer, all_players, 50)


