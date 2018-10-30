function printSentence(id, sentence){
    for(var i = 0; i < sentence.length; i++){
      (function(index) {
        setTimeout(function() {
          document.getElementById(id).innerHTML+=sentence[index]; 
        }, 100 * i);
      })(i);
    }
  }

  var scenes = {
    "lil1":{"bounds:": {"tlx":300,"tly":200,"brx":500,"bry":400}, "text": ["Lilly likes playing outside", "One day, she stumbled into the woods.", 
    "There, she meets a lonely man.", "**Man Do you want to go to my cabin", "yes->cabin1 no->room1"]},

    //cabin

    "cabin1": {"text":["The man takes her back to the cabin", "You get murdered"]},

    //room1
    "room1":{"bounds:": {"tlx":2310,"tly":1000,"brx":3031,"bry":1705}, "text": ["Lilly decides not to go wth the man and goes home.", "Her parents divorced when she was 12.", 
    "As such she spends most of her time in her room ...", "with her dolls", "continue->room2"]},

    "room2": {"bounds:": {"tlx":100,"tly":90,"brx":350,"bry":258}, "text": ["Lilly has many dolls", "Her favourite is named Sussie.", "Sussie is good at school, good at house work, and embodies everything that Lilly isn't",
    "Lilly makes her parents angry all the time.", "She hates it when her mom gives out to her", "She gets punished every time", "continue->room3"]},

    "room3": {"bounds": {"tlx":624,"tly":308,"brx":818,"bry":489}, "text": ["Lilly's mom likes to stare out the window.", 
    "She doesn't do house work since Lilly's father left","Continue->room4"]},

    "room4": {"text":["**Mom \"GET OUT!!!\"", "Lilly's mom gets into bouts of depression.", "She takes her anger out on Lilly",
    "Run_out_of_house->cabin1 Stay->room5"]},
    "room5": {"text":["**Lilly I HATE YOU", "Lilly Grabs a nearby vase and hits her mom over the head with it.", "YOU WIN"]},


    // out
    "out1": {"text": ["**Mom \"IMMA GET YOU\"", "Lilly runs away", "She finds herself in the woods", "She sees the man","**Do you want to come back to my place little girl??????",
    "go_to_his_place->cabin1"]}
};

var start = "lil1";


function interp(line) {

        if (line.startsWith("**")) {
            var l = line.split(" ");
            var name = "<i>" + l[0].replace("**", "") + "</i>: ";
            l.shift();
            return name + l.join(" ");
        }
        
        else if (line.includes("->")) {
            var l = line.split(" ");
            var out = "";

            for (x in l) {
                var cond = l[x];
                var coo = cond.split("->");
                var text = coo[0];
                var loc = coo[1]
                out += "&nbsp;<span onClick='route(\"" + loc +"\")'>" + text +"</span>&nbsp;";
            }
            return out;
        }

        else {
            return line;
        }
    

}

//console.log(interp(scenes["lil1"][4]));

function iter(arr) {

    for (x in arr) {
        return interp(arr[x])
    }

}

// **Speaker
// last index - option->ref
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

var a = 0
function drawtext(loc)
{
    document.getElementById("aa").innerHTML = interp(scenes[loc].text[a]) + "\n"
    a = a + 1
    if(a != scenes[loc].text.length) setTimeout(function(){drawtext(loc)},3000)
}

class App
{
    constructor()
    {
        drawtext("lil1")
        for (var i = 0; i < scenes["lil1"].text.length; i++)
        {
            //document.getElementById("aa").innerHTML += " " + interp(scenes["lil1"].text[i]) + "\n"
        }

        console.log("spooky")
        this.canvas = document.getElementById("g")
        this.ctx = this.canvas.getContext('2d')

        this.canvas.width = 768 //document.width is obsolete
        this.canvas.height =432; //document.height is obsolete
        this.scalex = 3
        this.scaley = 3
        this.offsetx = -256
        this.offsety = -64
        
        this.mouseposx = 0
        this.mouseposy = 0

        var self = this
        this.currentScene = new Image;

        this.currentScene.src = "scenes/lil1.jpg"
        this.loaded = false

        this.currentScene.onload = function()
        {
            self.loaded = true
            
        }

        this.getMousePos = function(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
            };
          }

        this.canvas.addEventListener("click", function(evt)
        {
            var mouse = getMousePos(self.canvas,evt)

            var x =  ((mouse.x/self.canvas.offsetWidth)*(768))
            var y = ((mouse.y/self.canvas.offsetHeight)*(432))


        })

        this.canvas.addEventListener('mousemove', function(evt) {
            var mousePos = getMousePos(self.canvas, evt);
            var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
            //console.log(mousePos.x, mousePos.y)

            self.offsetx -= ((((mousePos.x-(768/2))) * 0.0015))
            self.offsety -= ((((mousePos.y-(432/2))) * 0.0015))

            self.offsetx = Math.min(768, Math.max(-768, self.offsetx))
            self.offsety = Math.min(432, Math.max(-432, self.offsety))
            
            self.mouseposx = mousePos.x
            self.mouseposy = mousePos.y
            //console.log(self.offsetx,self.offsety)
        }, false);
            

    }

    run()
    {
        var self = this
        window.requestAnimationFrame(function(){ self.loop(self) })
    }

    loop(self)
    {


        if(self.loaded)
        {
            self.ctx.save();
            self.ctx.globalCompositeOperation = "source-over"

            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

            self.ctx.fillStyle = "rgb(0,0,0)"
            self.ctx.fillRect(0, 0, 768, 432)
            self.ctx.scale(self.scalex,self.scaley)
            self.ctx.translate(self.offsetx, self.offsety)
            self.ctx.drawImage(self.currentScene,0,0,768,432);
            self.ctx.setTransform(1, 0, 0, 1, 0, 0);

            self.ctx.globalCompositeOperation = "destination-atop"

            var x = (self.mouseposx/self.canvas.offsetWidth)*(768)
            var y = (self.mouseposy/self.canvas.offsetHeight)*(432)
            // Radii of the white glow.
            var innerRadius = 32
            var outerRadius = 48;
            // Radius of the entire circle.
            var radius = 128;
    
            var gradient = self.ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
            gradient.addColorStop(0, 'rgba(200,200,200,0.35)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.0)');
            
            
            self.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            
            self.ctx.fillStyle = gradient;
            self.ctx.fill();

            self.ctx.globalCompositeOperation = "destination-over"

            self.ctx.fillStyle = "rgba(0,0,0,0.75)"
            self.ctx.fillRect(0, 0, 768, 432)


            self.ctx.globalAlpha = 1
            self.ctx.fillRect(0, 0, 768, 432)
            self.ctx.scale(self.scalex,self.scaley)
            self.ctx.translate(self.offsetx, self.offsety)
            self.ctx.drawImage(self.currentScene,0,0,768,432);
            self.ctx.setTransform(1, 0, 0, 1, 0, 0);
            self.ctx.globalOpacity = 1

        

            self.ctx.restore();


            

            
        }
        
        window.requestAnimationFrame(function(){ self.loop(self) })
    }
}

var app = new App();
app.run()

function route(loc)
{
    console.log(loc)
    document.getElementById("aa").innerHTML = ""
    for (var i = 0; i < scenes[loc].text.length; i++)
    {
        //document.getElementById("aa").innerHTML += " " + interp(scenes[loc].text[i]) + "\n"
    }
    a = 0
    drawtext(loc)
    app.loaded = false
    app.currentScene.src = "scenes/"+loc+".jpg"
}