;(function () {
	let canvas, ctx, ball, paddle_1, paddle_2, walls, player_1, player_2
	let pressed = 
	{
		up: false,
		down: false,
		w: false,
		s: false
	}
	let point_scored = false

	function init ()
	{
		canvas = document.getElementById("gameCanvas")
		ctx = canvas.getContext('2d')

		canvas.width = 800
		canvas.height = 500

		player_1 = 
		{
			score: 0,
			is_goal: false
		}

		player_2 = 
		{
			score: 0,
			is_goal: false
		}

		ball = 
		{
			width: 20,
			height: 20,
			x: canvas.width / 2 - 10,
			y: canvas.height / 2 - 10,
			vel_x: 5,
			vel_y: 5,
			fillColor: 'white'
		}

		paddle_1 = 
		{
			width: 15,
			height: 100,
			x: 15,
			y: canvas.height / 2 - 50,
			vel_y: 0,
			fillColor: 'white'
		}

		paddle_2 = 
		{
			width: 15,
			height: 100,
			x: canvas.width - 30,
			y: canvas.height / 2 - 50,
			vel_y: 0,
			fillColor: 'white'
		}

		walls = 
		{
			fillColor: 'white',

			left_wall_upper:
			{
				x: 0,
				y: 0,
				width: 12,
				height: 150
			},

			right_wall_upper: 
			{
				x: canvas.width - 12,
				y: 0,
				width: 12,
				height: 150
			},

			left_wall_lower:
			{
				x: 0,
				y: canvas.height - 150,
				width: 12,
				height: 150
			},

			right_wall_lower: 
			{
				x: canvas.width - 12,
				y: canvas.height - 150,
				width: 12,
				height: 150
			},

			top_wall:
			{
				x: 0,
				y: 0,
				width: canvas.width,
				height: 12
			},

			bottom_wall:
			{
				x: 0,
				y: canvas.height - 15,
				width: canvas.width,
				height: 15
			},

			invisble_goal_wall_1:
			{
				x: -12,
				y: 150,
				width: 12,
				height: 200
			},

			invisble_goal_wall_2:
			{
				x: canvas.width + 12,
				y: 150,
				width: 12,
				height: 200
			}
		}

		window.requestAnimationFrame(update)
	}

	function draw_left_wall ()
	{
		ctx.save()
		ctx.fillStyle = walls.fillColor
		ctx.beginPath()
		ctx.rect(walls.left_wall_upper.x, walls.left_wall_upper.y, walls.left_wall_upper.width, walls.left_wall_upper.height)
		ctx.rect(walls.left_wall_lower.x, walls.left_wall_lower.y, walls.left_wall_lower.width, walls.left_wall_lower.height)
		ctx.fill()
		ctx.restore()
	}

	function draw_right_wall ()
	{
		ctx.save()
		ctx.fillStyle = walls.fillColor
		ctx.beginPath()
		ctx.rect(walls.right_wall_upper.x, walls.right_wall_upper.y, walls.right_wall_upper.width, walls.right_wall_upper.height)
		ctx.rect(walls.right_wall_lower.x, walls.right_wall_lower.y, walls.right_wall_lower.width, walls.right_wall_lower.height)
		ctx.fill()
		ctx.restore()
	}

	function draw_top_wall ()
	{
		ctx.save()
		ctx.fillStyle = walls.fillColor
		ctx.beginPath()
		ctx.rect(walls.top_wall.x, walls.top_wall.y, walls.top_wall.width, walls.top_wall.height)
		ctx.fill()
		ctx.restore()
	}

	function draw_bottom_wall ()
	{
		ctx.save()
		ctx.fillStyle = walls.fillColor
		ctx.beginPath()
		ctx.rect(walls.bottom_wall.x, walls.bottom_wall.y, walls.bottom_wall.width, walls.bottom_wall.height)
		ctx.fill()
		ctx.restore()
	}

	function draw_walls ()
	{
		draw_left_wall()
		draw_right_wall()
		draw_top_wall()
		draw_bottom_wall()
	}

	function draw_ball ()
	{
		ctx.save()
		ctx.fillStyle = ball.fillColor
		ctx.beginPath()
		ctx.rect(ball.x, ball.y, ball.width, ball.height)
		ctx.fill()
		ctx.restore()
	}

	function draw_paddle_1 ()
	{
		ctx.save()
		ctx.fillStyle = paddle_1.fillColor
		ctx.beginPath()
		ctx.rect(paddle_1.x, paddle_1.y, paddle_1.width, paddle_1.height)
		ctx.fill()
		ctx.restore()
	}

	function draw_paddle_2 ()
	{
		ctx.save()
		ctx.fillStyle = paddle_2.fillColor
		ctx.beginPath()
		ctx.rect(paddle_2.x, paddle_2.y, paddle_2.width, paddle_2.height)
		ctx.fill()
		ctx.restore()
	}

	function draw_center_line ()
	{
		ctx.save()
		ctx.fillStyle = 'white'
		var height = 49
		var x = canvas.width / 2 - 3
		var width = 6
		for(var y = 22; y < canvas.height - walls.bottom_wall.height - 10; y += (height + 10) )
		{
			ctx.rect(x, y, width, height)
			ctx.fill()
		}
		ctx.restore()
	}

	function draw_scores ()
	{
		ctx.save()
		ctx.fillStyle = 'red'
		ctx.font = 'bold 20px Roboto'
		ctx.textAlign = 'left'
		ctx.textBaseline = 'alphabetic'
		var text_width = ctx.measureText('player 1: ' + player_1.score).width
		var text_height = ctx.measureText('player_1: ' + player_1.score).height
		ctx.fillText('player_1: ' + player_1.score, text_width-62, 50)
		text_width = ctx.measureText('player 2: ' + player_2.score).width
		text_height = ctx.measureText('player_2: ' + player_2.score).height
		ctx.fillText('player_2: ' + player_2.score, canvas.width-text_width-32, 50)
		ctx.restore() 
	}

	function check_paddle_1_bounds ()
	{
		if(paddle_1.y < walls.top_wall.y + walls.top_wall.height) { paddle_1.y = walls.top_wall.y + walls.top_wall.height; }
		else if(paddle_1.y + paddle_1.height > walls.bottom_wall.y) { paddle_1.y = walls.bottom_wall.y - paddle_1.height; }
	}

	function check_paddle_2_bounds ()
	{
		if(paddle_2.y < walls.top_wall.y + walls.top_wall.height) { paddle_2.y = walls.top_wall.y + walls.top_wall.height; }
		else if(paddle_2.y + paddle_2.height > walls.bottom_wall.y) { paddle_2.y = walls.bottom_wall.y - paddle_2.height; }
	}

	function check_sprite_boundaries ()
	{
		check_paddle_1_bounds()
		check_paddle_2_bounds()
	}

	function in_range (x, r1, r2)
	{
		return (x >= r1 && x <= r2)
	}

	function rect_collision (rect1, rect2)
	{
		return (((in_range(rect1.x, rect2.x, rect2.x+rect2.width) || in_range(rect1.x+rect1.width, rect2.x, rect2.x+rect2.width)) &&
			(in_range(rect1.y, rect2.y, rect2.y+rect2.height) || in_range(rect1.y+rect1.height, rect2.y, rect2.y+rect2.height))) ||
			 ((in_range(rect2.x, rect1.x, rect1.x+rect1.width) || in_range(rect2.x+rect2.width, rect1.x, rect1.x+rect1.width)) &&
			(in_range(rect2.y, rect1.y, rect1.y+rect1.height) || in_range(rect2.y+rect2.height, rect1.y, rect1.y+rect1.height))))
	}

	function reset_field ()
	{
		ball.x = canvas.width / 2 - 10
		ball.y = canvas.height / 2 - 10
		ball.vel_x *= -1
	}

	function update_ball_position ()
	{

		if(rect_collision(ball, paddle_1))
		{
			console.log("contact")
			ball.x = paddle_1.x + paddle_1.width + 1
			ball.vel_x *= -1
		}
		else if(rect_collision(ball, paddle_2))
		{
			console.log("contact")
			ball.x = paddle_2.x - ball.width - .1
			ball.vel_x *= -1
		}

		if(rect_collision(ball, walls.left_wall_upper)) { ball.x = walls.left_wall_upper.x+walls.left_wall_upper.width + .1; ball.vel_x *= -1; }
		else if(rect_collision(ball, walls.left_wall_lower)) { ball.x = walls.left_wall_lower.x+walls.left_wall_lower.width + .1; ball.vel_x *= -1; }
		else if(rect_collision(ball, walls.right_wall_upper)) { ball.x = walls.right_wall_upper.x-ball.width - .1; ball.vel_x *= -1; }
		else if(rect_collision(ball, walls.right_wall_lower)) { ball.x = walls.right_wall_lower.x-ball.width - .1; ball.vel_x *= -1; }
		else if(rect_collision(ball, walls.top_wall)) { ball.y = walls.top_wall.y+walls.top_wall.height + .1; ball.vel_y *= -1; }
		else if(rect_collision(ball, walls.bottom_wall)) { ball.y = walls.bottom_wall.y-ball.height - .1; ball.vel_y *= -1; }
		else if(rect_collision(ball, walls.invisble_goal_wall_1))
		{
			player_1.score += 1
			reset_field()
		}
		else if(rect_collision(ball, walls.invisble_goal_wall_2))
		{
			player_2.score += 1
			reset_field()
		}

		ball.x += ball.vel_x
		ball.y += ball.vel_y
	}

	function update_sprite_positions ()
	{
		if(pressed.w) { paddle_1.vel_y = -10; }
		else if(pressed.s) { paddle_1.vel_y = 10; }
		else { paddle_1.vel_y = 0; }

		if(pressed.up) { paddle_2.vel_y = -10; }
		else if(pressed.down) { paddle_2.vel_y = 10; }
		else { paddle_2.vel_y = 0; }

		update_ball_position()

		paddle_1.y += paddle_1.vel_y;
		paddle_2.y += paddle_2.vel_y;
	}


	function draw ()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		draw_center_line()
		draw_walls()
		draw_scores()
		draw_ball()
		draw_paddle_1()
		draw_paddle_2()
	}

	function key_down (e)
	{
		if(e.key == "Up" || e.key == "ArrowUp") pressed.up = true;
		else if(e.key == "Down" || e.key == "ArrowDown") pressed.down = true;	
		if(e.key == "w") pressed.w = true;
		else if(e.key == "s") pressed.s = true;
	}

	function key_up (e)
	{
		if(e.key == "Up" || e.key == "ArrowUp") pressed.up = false;
		else if(e.key == "Down" || e.key == "ArrowDown") pressed.down = false;	
		if(e.key == "w") pressed.w = false;
		else if(e.key == "s") pressed.s = false;
	}

	function update ()
	{
		
		window.requestAnimationFrame(update)

		//console.log(pressed)

		check_sprite_boundaries()

		update_sprite_positions()

		draw()
	}

	//init()

	//draw()

	document.addEventListener('keydown', key_down, false)
	document.addEventListener('keyup', key_up, false)
	document.addEventListener('DOMContentLoaded', init)
})()