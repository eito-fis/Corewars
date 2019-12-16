//React play page

import React, {Component} from "react"
import { Link } from 'react-router-dom'
import { Command, Add, Dat, Div, Djn, Jmn,
    Jmp, Jmz, Mod, Mov, Mul, Seq,
    Slt, Sne, Spl, Sub } from  './corewars/instructions'


export default class Play extends Component {
    constructor() {
        super();
        var d1 = 5
        var d2 = 10
        var w = 1015
        var h = 815
        var wn = 25
        var hn = 25
        var sl = 5
        var game_length = 1000
        var final_length = 0

        var memory_size = 625
        var memory = this.init(memory_size)
        var player1_code = [new Mov(0, 1, "$", "$", "I", memory, memory_size, 0)] // array of commands
        var player2_code = [new Add(4, 3, '#','$', 'AB', memory, memory_size, 17),
            new Mov(2, 2, "$", "@", "I", memory, memory_size, 18),
            new Jmp(-2, 0,'$', '$', '', memory, memory_size, 19 ),
            new Dat(0, 0, '$', '$', '', memory, memory_size, 20)]
        var code = [player1_code, player2_code]
        var players = this.make_players(memory, code)

        this.state = {
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
                ratio: window.devicePixelRatio || 1,
            },
            ctx: null,
            memory_size: memory_size,
            memory: memory,
            players: players,
            d1: d1,
            d2: d2,
            w: w,
            h: h,
            wn: wn,
            hn: hn,
            sl: sl,
            game_length: game_length,
            done: null,
            final_length: final_length,
            i: -1,
            p: -1
        }
    }

    handleResize(value, e){
        this.setState({
            screen : {
                width: window.innerWidth,
                height: window.innerHeight,
                ratio: window.devicePixelRatio || 1,
            }
        });
    }

    * gen(processes) {
        while (processes.length > 0) {
            for (let [index, value] of processes.entries()) {
                yield [processes, index]
            }
        }
        yield null
    }

    init(memory_size) {
        var memory = []
        for (let i = 0; i < memory_size; i++) {
            memory.push(new Dat(0, 0, "$", "$", "", memory, memory_size))
            memory[memory.length - 1].init(i, -1)
        }
        return memory
    }

    check_memory(memory, start, code_len) {
        for (var i = 0; i < code_len; i++) {
            if (memory[(start + i) % memory.length].player_id != -1)
                return false
        }
        return true
    }

    set_code(memory, code, player_id) {
        // Find a starting location that doesn't overlap with player code
        var start = Math.floor(Math.random() * (memory.length - 1))
        while (!this.check_memory(memory, start, code.length)) {
            start = Math.floor(Math.random() * (memory.length - 1))
        }

        for (var i = 0; i < code.length; i++) {
            var address = (start + i) % memory.length
            memory[address] = code[i]
            memory[address].init(address, player_id)
        }
        return start
    }

    make_players(memory, code) {
        let players = []
        for (var i = 0; i < code.length; i++) {
            let start = this.set_code(memory, code[i], i)
            // Start new process where code was written
            players.push(this.gen([start]))
        }
        return players
    }

    updateCanvas(){
        var count = 0
        let {wn, hn, memory, d1, d2, sl, ctx} = this.state
        for (var w_inc=0; w_inc<wn; w_inc++){
            for (var h_inc=0; h_inc<hn; h_inc++){
                ctx.beginPath();
                ctx.strokeStyle = "gray";
                if(memory[count].player_id == 0)
                    ctx.strokeStyle = "red";
                else if(memory[count].player_id == 1)
                    ctx.strokeStyle = "blue";
                ctx.beginPath();
                ctx.rect(d2+w_inc*(sl+d1), d2+h_inc*(sl+d1), sl, sl);
                ctx.stroke();
                count++
            }
        }
    }

    startCanvas(){
        var count = 0
        let {wn, hn, memory, d1, d2, sl, ctx, code} = this.state
        for (var w_inc=0; w_inc<wn; w_inc++){
            for (var h_inc=0; h_inc<hn; h_inc++){
                ctx.strokeStyle = "gray";
                ctx.beginPath();
                ctx.rect(d2+w_inc*(sl+d1), d2+h_inc*(sl+d1), sl, sl);
                ctx.stroke();
            }
        }
    }

    step(i, p) {
        let {game_length, memory, code, c, ctx, players} = this.state
        let {width, height} = this.state.screen
        console.log(players)
        console.log(players[p])
        console.log(p)
        let ret = players[p].next().value
        if (ret) {
            let [current_list, index] = ret
            let address = current_list[index]
            memory[address].call(current_list, index, players[p], p)

            ctx.clearRect(0, 0, width, height);
            this.updateCanvas()

            if (--i)
                this.update()
            else
                this.setState({ done: -1, final_length: game_length })
        } else {
            let winner = (p + 1 == players.length ? 0 : p + 1) 
            let final_length = this.state.final_length + game_length - i + 1
            this.setState({ done: winner, final_length: final_length })
        }
    }

    update() {
        let {game_length, players, i, p} = this.state
        if (i == -1) {
            this.setState({ done: null })
            i = game_length
        }
        if (p == -1 || p == players.length - 1)
            p = 0
        else 
            p += 1
        this.setState({ i: i, p: p})
        setTimeout(() => {requestAnimationFrame(() => {this.step(i, p)})}, 100)
    }

    componentDidMount() {
        const ctx = this.refs.canvas.getContext('2d');
        console.log(this.state.memory)
        this.setState({ ctx: ctx }, 
            () => {
                this.startCanvas()
                this.updateCanvas()
            })
    }

    render(){
        return(
            <canvas ref="canvas" id="myCanvas" width="1015" height="815"></canvas>
        )
    }
}