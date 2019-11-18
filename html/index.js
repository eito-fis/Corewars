
// SETTING UP CLASSES

class Byte {
    constructor(){
        this.playerID =  Math.floor(Math.random()*2)
    }
    transform(){
        this.playerID =  Math.floor(Math.random()*2)
    }
}

class Bit {
    constructor(){
        //simulates player id
        this.playerID =  Math.floor(Math.random()*2)
    }
    transform(){
        this.playerID =  Math.floor(Math.random()*2)
    }
}

class Bote {
    constructor(){
        this.playerID = Math.floor(Math.random()*2)
    }

    transform(){
        this.playerID = Math.floor(Math.random()*2)
    }
}


// SETTING UP MATRIX

$(function(){
    var memory_length = 8000
    var memory = []
    for (var i=0;i<=memory_length;i++){
        switch(Math.floor(Math.random()*3)) {
            case 0:
                memory.push(new Byte())
                break;
            case 1:
                memory.push(new Bit())
                break;
            case 2:
                memory.push(new Bote())
                break;
        }
    }


    //initializing rectangle matrix
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    var d1 = 5
    var d2 = 10
    var w = 1015
    var h = 815
    var wn = 100
    var hn = 80
    var sl = 5
    /*   
    critical defining functions. 
    here are some useful 

    (w-15)/(h-15) * z = y
    */  
    function updateCanvas(){
        var count = 0
        for (var w_inc=0; w_inc<wn; w_inc++){
            for (var h_inc=0; h_inc<hn; h_inc++){
                count++
                ctx.beginPath();
                ctx.strokeStyle = "white";
                if(memory[count].playerID==0)
                    ctx.strokeStyle = "red";
                else if(memory[count].playerID==1)
                    ctx.strokeStyle = "blue";
                ctx.beginPath();
                ctx.rect(d2+w_inc*(sl+d1), d2+h_inc*(sl+d1), sl, sl);
                ctx.stroke();
            }
        }
    }


    function startCanvas(){
        var count = 0
        for (var w_inc=0; w_inc<wn; w_inc++){
            for (var h_inc=0; h_inc<hn; h_inc++){
                ctx.strokeStyle = "gray";
                ctx.beginPath();
                ctx.rect(d2+w_inc*(sl+d1), d2+h_inc*(sl+d1), sl, sl);
                ctx.stroke();
            }
        }

    }

    startCanvas()

    // Something to change the value of the matrix,  
    function run(){
        for (var i=0; i<memory.length; i++){
            memory[i].transform()
        }
        ctx.clearRect(0, 0, c.width,c.height);
        updateCanvas()
    }

    $("#run_button").click(run)
})
