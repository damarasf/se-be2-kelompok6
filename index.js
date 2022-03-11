    //Defination of Global variable
		//Global Snake variable
        var Snake = null;						//Snake Object
        var SNAKENODE_LENGTH = 50;				//Length of each node of Snake's body
        var SNAKE_SIZE = 6;						//How much size of new born Snake
        var SNAKE_DIRECTION = null;				//Direction of next moving
        var SNAKE_DIRECTION_LOCK = false;		//Prevent double or more clicks constantly of two or more different directions , snake will go against if not or others stange thing if not.
        var DELAY = 120;						//Delay of moving Snake , this variable control the snake's speed
        var Interval = null;					//Interval Object of moving Snake for Pause and Start
            //Global Canvas variable
        var CANVAS;								//Canvas Object
        var CANVAS_WIDTH = 0;					//Width of Canvas
        var CANVAS_HEIGHT = 0;					//Height of Canvas
        var ctx = null;							//Context of Canvas
        var stage_map = null;					//Map status of each block in coordinate
            //Global Canvas variable
        var SCORE = 0;							//How many food Snake has eaten
        var PANEL_BUTTONS = null;				//Array of Buttons
        var PANEL_BUTTON_WIDTH = 0;				//Width of each button
        var PANEL_BUTTON_HEIGHT = 0;			//Height of each button
            //Global Stage variable
        var STAGE_MARGIN = 0; 					//The margin will be drawed with panel
        var STAGE_X_COUNT = 0;					//The count of stage's horizontal axis
        var STAGE_Y_COUNT = 0;					//The count of stage's vertical axis
        var STAGE_WIDTH = 0;					//Width of stage
        var STAGE_HEIGHT = 0;					//Height of stage
            //Gloabl Game status and some switch
        var GAME_STATUS = true;					//The Status of game(true is runing , false is died)    
    
    
    
    
        //init Functions
            //init Panel's size
        function initPanel() {
            STAGE_MARGIN = 300;
            PANEL_BUTTON_WIDTH = 280;
            PANEL_BUTTON_HEIGHT = 80;
        }
            //init Buttons in Panel
        function initButtons() {
            //define text and click event in array to next looping
            var texts = ["Level: 1", "Pause"];
            var events = [
                
                function () {
                    if (Interval == null) {
                        if(GAME_STATUS){
                            Start();
                        }else{
                            ReStart();
                        }
                        PANEL_BUTTONS[3].text = "Pause";
                    } else {
                        PANEL_BUTTONS[3].text = "Start";
                        Pause();
                    }
                    drawButton(PANEL_BUTTONS[3]);
                }
            ];
            PANEL_BUTTONS = [];
    
            for (var i = 0; i < texts.length; i++) {
                PANEL_BUTTONS.push({text: texts[i], x: 10, y: 110 + 90 * i, event: events[i]});
            }
        }
            //init the stage where snake will move onto.
        function initStage() {
            STAGE_X_COUNT = parseInt((document.body.clientWidth - STAGE_MARGIN - 20) / SNAKENODE_LENGTH);
            STAGE_Y_COUNT = parseInt((document.body.clientHeight - 20) / SNAKENODE_LENGTH);
    
            STAGE_WIDTH = STAGE_X_COUNT * SNAKENODE_LENGTH;
            STAGE_HEIGHT = STAGE_Y_COUNT * SNAKENODE_LENGTH;
        }
            //init Canvas's size and return context of it
        function initCanvas() {
            CANVAS_WIDTH = STAGE_MARGIN + STAGE_WIDTH;
            CANVAS_HEIGHT = STAGE_HEIGHT;
    
            CANVAS = document.createElement("canvas");
            CANVAS.width = CANVAS_WIDTH;
            CANVAS.height = CANVAS_HEIGHT;
            document.body.appendChild(CANVAS);
            CANVAS.style.marginTop = (document.body.clientHeight - CANVAS_HEIGHT) / 2 + "px";
            CANVAS.style.marginLeft = (document.body.clientWidth - CANVAS_WIDTH) / 2 + "px";
    
            return CANVAS.getContext("2d");
        }
            //init a map of stage for storing each stauts of coordinate
        function initMap() {
            stage_map = [];
            for (var i = 0; i < STAGE_X_COUNT; i++) {
                stage_map.push(new Array(STAGE_Y_COUNT))
            }
        }
            //define class of each node of Snake's body
        function SnakeNode(x, y, c) {
            this.x = x;
            this.y = y;
            this.color = c;
        }
            //define Snake's born coordinate and born direction
        function initSnake() {
            //producing random x and y for Snake's head , and limit them to secure range
            var rand_x = Math.floor(Math.random() * ( STAGE_X_COUNT - SNAKE_SIZE * 2 ) + SNAKE_SIZE);
            var rand_y = Math.floor(Math.random() * ( STAGE_Y_COUNT - SNAKE_SIZE * 2 ) + SNAKE_SIZE);
            //rand a direction for first moving
            var rand_dir = ["w", "e", "n", "s"][parseInt(Math.random() * 4)];
            SNAKE_DIRECTION = rand_dir;
            Snake = [];
            Snake.push(new SnakeNode(rand_x, rand_y, "red", rand_dir));
            stage_map[rand_x][rand_y] = "snake";
    
            for (var i = 1; i < SNAKE_SIZE; i++) {
                var count_coor_x, count_coor_y;
                switch (rand_dir) {
                    case "w":
                        count_coor_x = rand_x + i;
                        count_coor_y = rand_y;
                        break;
                    case "e":
                        count_coor_x = rand_x - i;
                        count_coor_y = rand_y;
                        break;
                    case "n":
                        count_coor_x = rand_x;
                        count_coor_y = rand_y + i;
                        break;
                    case "s":
                        count_coor_x = rand_x;
                        count_coor_y = rand_y - i;
                        break;
                }
    
                Snake.push(new SnakeNode(count_coor_x, count_coor_y, "black", rand_dir));
                stage_map[count_coor_x][count_coor_y] = "snake";//mark coordinate of stage_map to snake
            }
        }
        //produce a food or stone
        function produceSingle(type) {
            var rand_x = parseInt(Math.random() * STAGE_X_COUNT);
            var rand_y = parseInt(Math.random() * STAGE_Y_COUNT);
    
            if (stage_map[rand_x][rand_y]) return produceSingle(type);
            if(type == "food"){
                stage_map[rand_x][rand_y] = "food";
            }else{
                stage_map[rand_x][rand_y] = "stone";
            }
        }
        //First init
        function init() {
            initPanel();
            initButtons();
            initStage();
            initMap();
            initSnake();
            produceSingle("food");//produce food after init of Snake
            ctx = initCanvas();
            bind();
            drawScore();
            drawButtons();
            Start();
        }
    
    
    
    
    
    
    
    
    
        //draw about Pannel Function
        function drawScore() {
            ctx.beginPath();
            ctx.rect(10.5, 0, 280, 100.5);
            ctx.closePath();
            ctx.fillStyle = "#f2f2f2";
            ctx.fill();
            ctx.font = "bolder 40px Microsoft Yahei";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Score : " + SCORE, 150, 50);
        }
        //draw single button
        function drawButton(obj,color) {
            ctx.beginPath();
            ctx.rect(obj.x, obj.y, PANEL_BUTTON_WIDTH, PANEL_BUTTON_HEIGHT);
            ctx.closePath();
            ctx.fillStyle = "#1abc9c";
            ctx.fill();
            ctx.font = "bolder 30px Microsoft Yahei";
            ctx.fillStyle = color || "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(obj.text, PANEL_BUTTON_WIDTH / 2 + 10, obj.y + PANEL_BUTTON_HEIGHT / 2);
        }
        //draw each button once for init
        function drawButtons() {
            for (var i = 0; i < PANEL_BUTTONS.length; i++) {
                drawButton(PANEL_BUTTONS[i]);
            }
        }
    
    
    
    
    
    
    
    
    
    
    
        //draw about Stage Function
        function drawSnake() {
            for (var i = 0; i < Snake.length; i++) {
                var node = Snake[i];
                ctx.beginPath();
                ctx.rect(node.x * SNAKENODE_LENGTH + STAGE_MARGIN, node.y * SNAKENODE_LENGTH, SNAKENODE_LENGTH, SNAKENODE_LENGTH);
                ctx.closePath();
                ctx.fillStyle = node.color;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "white";
                // ctx.stroke();
            }
        }
        //loop stage_map and draw where was marked as food or stone
        function drawSingle() {
            for (var i = 0; i < STAGE_X_COUNT; i++) {
                for (var j = 0; j < STAGE_Y_COUNT; j++) {
                    if (stage_map[i][j] && stage_map[i][j] != "snake") {
                        ctx.beginPath();
                        ctx.rect(i * SNAKENODE_LENGTH + STAGE_MARGIN, j * SNAKENODE_LENGTH, SNAKENODE_LENGTH, SNAKENODE_LENGTH);
                        ctx.closePath();
                        switch (stage_map[i][j]){
                            case "food":
                                ctx.fillStyle = "green";
                                break;
                            case "stone":
                                ctx.fillStyle = "grey";
                        }
                        ctx.fill();
                        ctx.strokeStyle = "white";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            }
        }
    
        function drawStage() {
            ctx.beginPath();
            ctx.rect(STAGE_MARGIN - 0.5, 0, STAGE_WIDTH, STAGE_HEIGHT); //substarcting 0.5 for widths of all line look same;
            ctx.closePath();
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = ALLOW_INWALL ? "#d2d2d2" : "red";
            ctx.stroke();
        }
    
        function draw() {
            if(GAME_STATUS){
                drawStage();
                drawSingle();
                drawSnake();
            }
        }
    
    
    
    
    
    
    
    
    
    
    
        //Action Funciton
        function moveSnake(direction) {
            var head = Snake[0];
            var in_wall = false;
    
            var x_difference = (STAGE_WIDTH - SNAKENODE_LENGTH) / SNAKENODE_LENGTH;
            var y_difference = (STAGE_HEIGHT - SNAKENODE_LENGTH) / SNAKENODE_LENGTH;
            var coor = {};
            switch (direction) {//Set coordinate of the next head node
                case "e":
                    coor.y = head.y;
                    if (head.x < x_difference) {
                        coor.x = head.x + 1;
                    } else if (head.x == x_difference) {
                        coor.x = 0;
                        in_wall = true;
                    }
                    break;
                case "w":
                    coor.y = head.y;
                    if (head.x > 0) {
                        coor.x = head.x - 1;
                    } else if (head.x == 0) {
                        coor.x = x_difference;
                        in_wall = true;
                    }
                    break;
                case "n":
                    coor.x = head.x;
                    if (head.y > 0) {
                        coor.y = head.y - 1;
                    } else if (head.y == 0) {
                        coor.y = y_difference;
                        in_wall = true;
                    }
                    break;
                case "s":
                    coor.x = head.x;
                    if (head.y < y_difference) {
                        coor.y = head.y + 1;
                    } else if (head.y == y_difference) {
                        coor.y = 0;
                        in_wall = true;
                    }
                    break;
            }
    
            if(!ALLOW_INWALL && in_wall){
                return Died();
            }
    
            head.color = "black";
    
            stage_map[Snake[Snake.length - 1].x][Snake[Snake.length - 1].y] = false; //mark false before pop
            switch (stage_map[coor.x][coor.y]) {
                case "stone" ://Turn to Died when the next head coordinate was marked as stone or snake
                case "snake" :
                    head.color = "red";
                    return Died();
                    break;
                case "food" ://Eate a food and do not pop Snake array , so the snake will increase one size
                    Snake.unshift(new SnakeNode(coor.x, coor.y, "red", direction));
                    SCORE++;
                    drawScore();
                    produceSingle("food");
                    if(ALLOW_STONE){
                        if(30>= SCORE && SCORE >= 10) {
                            produceSingle("stone");
                        }else if(SCORE > 30){
                            produceSingle("stone");
                            produceSingle("stone");
                        }
                    }
                    break;
                default :
                    Snake.unshift(new SnakeNode(coor.x, coor.y, "red", direction));
                    Snake.pop();
            }
    
            stage_map[coor.x][coor.y] = "snake";   //mark snake after confirming whatever the head crashed
            SNAKE_DIRECTION_LOCK = false;
            
        }
    
        
        //the main interval function
        function main() {
            setInterval(function(){
                draw();
            },1000/100);
        }
    
    
    
    
    
    
    
    
        //Event Function
        function KeyDown(e) {
            if (SNAKE_DIRECTION_LOCK) {
                return;
            }
            var temp = SNAKE_DIRECTION;
            switch(e.keyCode){
                case 32:
                    PANEL_BUTTONS[3].event();
                    break;
                case 37:
                    if (SNAKE_DIRECTION != "e") {
                        SNAKE_DIRECTION = "w";
                    }
                    break;
                case 38:
                    if (SNAKE_DIRECTION != "s") {
                        SNAKE_DIRECTION = "n";
                    }
                    break;
                case 39:
                    if (SNAKE_DIRECTION != "w") {
                        SNAKE_DIRECTION = "e";
                    }
                    break;
                case 40:
                    if (SNAKE_DIRECTION != "n") {
                        SNAKE_DIRECTION = "s";
                    }
                    break;
            }
    
            SNAKE_DIRECTION_LOCK = temp != SNAKE_DIRECTION;
        }
            //get the coordinate of Cursor
        function getOffsetPosition(e) {
            var x, y;
            if ("layerX" in e) {
                x = e.layerX;
                y = e.layerY;
            } else {
                x = e.offsetX;
                y = e.offsetY;
            }
    
            return {x: x, y: y};
        }
            //Determine whatever the cursor is focusing on buttons
        function determineButton(e) {
            var coor = getOffsetPosition(e);
            var key;
    
            for (var i = 0; i < PANEL_BUTTONS.length; i++) {
                if (PANEL_BUTTONS[i].x <= coor.x && coor.x <= PANEL_BUTTONS[i].x + PANEL_BUTTON_WIDTH && PANEL_BUTTONS[i].y <= coor.y && coor.y <= PANEL_BUTTONS[i].y + PANEL_BUTTON_HEIGHT) {
                    key = i;
                    break;
                }
            }
    
            return key;
        }
            //Change cursor to pointer while the button is focus
        function MouseMove(e) {
            var key = determineButton(e);
            if (typeof key != "undefined") {
                if(key == 1) return CANVAS.style.cursor = "not-allowed";
            
                CANVAS.style.cursor = "pointer";
            } else {
                CANVAS.style.cursor = null;
            }
        }
            //Click Events
        function ClickButton(e) {
            var key = determineButton(e);
            if (typeof key != "undefined") {
                PANEL_BUTTONS[key].event();
            }
        }
            //debounce of events
        function debounce(callback, wait) {
            var lasttime = new Date();
            return function () {
                var now = new Date();
                if (now - lasttime > wait) {
                    lasttime = now;
                    callback.apply(this, arguments);
                }
            }
        }
            //bind Events
        function bind() {
            addEventListener("keydown", KeyDown);
            CANVAS.addEventListener("mousemove", debounce(MouseMove, 100));
            CANVAS.addEventListener("click", debounce(ClickButton, 500));
        }
            //Pause game and clear Interval
        function Pause() {
            clearInterval(Interval);
            Interval = null;
        }
            //Start game by setInterval function
        function Start() {
            Interval = setInterval(function () {
                moveSnake(SNAKE_DIRECTION);
            }, DELAY)
        }
            //ReStart Stage and Snake
        function ReStart(){
            GAME_STATUS = true;
            SCORE = 0;
            initStage();
            initMap();
            initSnake();
            produceSingle("food");//produce food after init of Snake
            drawScore();
            
            Start();
        }
            //End Game
        function Died() {
            Pause();
            draw();
            GAME_STATUS = false;
            PANEL_BUTTONS[3].text = "ReStart";
            drawButton(PANEL_BUTTONS[3],"red");
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = "black";
            ctx.fillRect(STAGE_MARGIN, 0, STAGE_WIDTH, STAGE_HEIGHT);
            ctx.globalAlpha = 1;
            ctx.font = "80px serif";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeText("You Already Dead !", STAGE_WIDTH / 2 + STAGE_MARGIN, STAGE_HEIGHT / 2);
        }
    
    
        //ROCK and ROLL
        init();
        main();