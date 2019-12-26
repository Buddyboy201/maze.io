;(function () {
	let canvas, ctx


	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext('2d');
	

	//document.addEventListener('DOMContentLoaded', init);

	function getDist (c1, c2)
	{
		x1 = c1[0]
		y1 = c1[1]
		x2 = c2[0]
		y2 = c2[1]
		with(Math)
		{
			return sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2))
		}
	}

	function getSlope(c1, c2)
	{
		x1 = c1[0]
		y1 = c1[1]
		x2 = c2[0]
		y2 = c2[1]
		return ((y1-y2)/(x1-x2))
	}

	function getIntersection(c1, m1, c2, m2)
	{
		x1 = c1[0]
		y1 = c1[1]
		x2 = c2[0]
		y2 = c2[1]
		x3 = (m1*x1 - m2*x2 + y2 - y1)/(m1 - m2)
		y3 = m2*x3 + y2
		return [x3, y3]
	}

	class Rectangle
	{
		constructor (
			x = 0, y = 0, width = 0, height = 0,
			fillColor = '', strokeColor = '', strokeWidth = 2)
		{
			this.x = Number(x)
			this.y = Number(y)
			this.width = Number(width)
			this.height = Number(height)
			this.fillColor = fillColor
			this.strokeColor = strokeColor
			this.strokeWidth = Number(strokeWidth)
		}

		get area () { return this.width * this.height }

		get left () { return this.x }

		get right () { return this.x + this.width }

		get top () { return this.y }

		get bottom () { return this.y + this.height }

		draw ()
		{
			const
			{
				x, y, width, height,
				fillColor, strokeColor, strokeWidth
			} = this

			ctx.save()

			ctx.fillStyle = fillColor
			ctx.lineWidth = strokeWidth
			ctx.beginPath()
			ctx.strokeStyle = strokeColor
			ctx.rect(x, y, width, height)

			ctx.fill()
			ctx.stroke()

			ctx.restore()
		}
	}

	class Triangle
	{
		constructor (
			top_x = 0, top_y = 0, left_x = 0, left_y = 0,
			right_x = 0, right_y = 0,
			fillColor = '', strokeColor = '', strokeWidth = 2)
		{
			this.top_x = Number(top_x)
			this.top_y = Number(top_y)
			this.left_x = Number(left_x)
			this.left_y = Number(left_y)
			this.right_x = Number(right_x)
			this.right_y = Number(right_y)
			this.fillColor = fillColor
			this.strokeColor = strokeColor
			this.strokeWidth = Number(strokeWidth)
		}

		get top () { return [this.top_x, this.top_y] }

		get left () { return [this.left_x, this.left_y] }

		get right () { return [this.right_x, this.right_y] }

		get area () { return Math.abs(this.left_x*(this.top_y-this.right_y)+this.top_x*(this.right_y-this.left_y)+this.right_x*(this.left_y-this.top_y))/2 }
	
		draw ()
		{
			const
			{
				top_x, top_y, left_x, left_y, right_x, right_y,
				fillColor, strokeColor, strokeWidth
			} = this

			ctx.save()

			ctx.fillStyle = fillColor
			ctx.lineWidth = strokeWidth
			ctx.beginPath()
			ctx.strokeStyle = strokeColor
			ctx.moveTo(this.left_x, this.left_y)
			ctx.lineTo(this.top_x, this.top_y)
			ctx.lineTo(this.right_x, this.right_y)
			//ctx.lineTo(this.left_x, this.left_y)
			ctx.closePath()
			ctx.fill()
			ctx.stroke()

			ctx.restore()
		}
	}

	class Arc
	{
		constructor (
			x = 0, y = 0, radius = 0, startAngle = 0,
			endAngle = 0, antiClockwise = false, fillColor = '',
			strokeColor =  '', strokeWidth = 0)
		{
			this.x = Number(x)
			this.y = Number(y)
			this.radius = Number(radius)
			this.startAngle = Number(startAngle)
			this.endAngle = Number(endAngle)
			this.antiClockwise = Boolean(antiClockwise)
			this.fillColor = fillColor
			this.strokeColor = strokeColor
			this.strokeWidth = Number(strokeWidth)
		}

		get center () { return [this.x, this.y] }

		get area () { return .5*this.radius*this.radius*(this.endAngle-this.startAngle) }
	
		draw ()
		{
			const
			{
				x, y, radius, startAngle, endAngle, antiClockwise,
				fillColor, strokeColor, strokeWidth
			} = this

			ctx.save()

			ctx.fillStyle = fillColor
			ctx.lineWidth = strokeWidth
			ctx.beginPath()
			ctx.strokeStyle = strokeColor

			ctx.arc(x, y, radius, startAngle, endAngle, antiClockwise)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
		}
	}

	class Grid
	{
		constructor (numSections = 0, fillColor = '', strokeColor = '', strokeWidth = 0, font = '')
		{
			this.fillColor = fillColor
			this.numSections = Number(numSections)
			this.strokeColor = strokeColor
			this.strokeWidth = Number(strokeWidth)
			this.font = font
		}

		draw_vertical ()
		{
			const
			{
				numSections, fillColor, strokeColor, strokeWidth, font
			} = this

			ctx.save()

			ctx.fillStyle = fillColor
			ctx.lineWidth = strokeWidth
			ctx.font = font
			
			ctx.strokeStyle = strokeColor
			var screen_width = canvas.width
			var interval = Math.floor(screen_width / this.numSections)
			for (var x = interval; x < screen_width; x += interval) 
			{
				ctx.beginPath()
				ctx.moveTo(x, 0)
				ctx.lineTo(x, canvas.height)
				ctx.stroke()
				ctx.fillText(x, x, 12)
				ctx.closePath()
			}

			
			ctx.restore()
		}

		draw_horizontal ()
		{
			const
			{
				numSections, fillColor, strokeColor, strokeWidth, font
			} = this

			ctx.save()

			ctx.fillStyle = fillColor
			ctx.lineWidth = strokeWidth
			ctx.font = font
			ctx.strokeStyle = strokeColor
			var screen_height = canvas.height
			var interval = Math.floor(screen_height / this.numSections)
			for (var y = interval; y < screen_height; y += interval) 
			{
				ctx.beginPath()
				ctx.moveTo(0, y)
				ctx.lineTo(canvas.width, y)
				ctx.stroke()
				ctx.fillText(y, 0, y)
				ctx.closePath()
			}

			
			
			ctx.restore()
		}
	}

	var grid = new Grid(10, 'gray', 'gray', .35, '14px Monospace')
	grid.draw_vertical()
	grid.draw_horizontal()
})()

