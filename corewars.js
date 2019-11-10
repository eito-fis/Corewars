function* gen(player_list) {
    while (true) {
        for ([index, value] of player_list.entries()) {
            yield [player_list, index]
        }
    }
}



memory_buffer = []
memory_size = 5
for (i = 0; i < memory_size; i++) {
    memory_buffer.append(0)
}

player1 = [0, 1, 2]
player2 = [0]
all_players = [gen(player1), gen(player2)]

game_length = 15
for (i = 0; i < game_length; i++) {
    for (p of all_players) {
        [current_list, index] = p.next().value
        address = current_list[index]

        memory[address].call(current_list, index)

        //current_list[index] = (index >= memory_size - 1) ? 0, current_list[index + 1]
        // current_list[index] = (address + 1) % memory_size
        console.log(current_list)
        
        // Handle splits
        // if (value == 0) {
        //      current_list.splice(index + 1, 0, 2)
        //      p.next()
        // }
    }
}

