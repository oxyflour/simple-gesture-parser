function hypot(dx, dy) {
	return Math.sqrt(dx * dx + dy * dy)
}

function middleOf(p1, p2) {
	return { x:(p1.x + p2.x) / 2, y:(p1.y + p2.y) / 2 }
}

function diffOf(p1, p2) {
	return { x:p1.x - p2.x, y:p1.y - p2.y }
}

function GestureParser(opts) {
	this.pts = [ ]
	this.opts = opts || { }
	this.opts.maxDistToLineScale = this.opts.maxDistToLineScale || 0.13
	this.opts.maxDistToCenterScale = this.opts.maxDistToCenterScale || 0.55
	this.opts.defaultParseSlope = this.opts.defaultParseSlope || 2.5
	this.opts.minDistanceToMove = this.opts.minDistanceToMove || 3
	this.opts.minPointsToReduce = this.opts.minPointsToReduce || 5
}

GestureParser.prototype.shouldReduce = function(pts) {
	var begin = pts[0],
		end = pts[pts.length - 1],
		middle = middleOf(begin, end),
		diff = diffOf(end, begin),
		length = hypot(diff.x, diff.y),
		maxDistToLine = length * this.opts.maxDistToLineScale,
		maxDistFromCenter = length * this.opts.maxDistToCenterScale
	return pts.length > 2 && pts.slice(1, -1).every(pt => {
		var dt = diffOf(pt, begin),
			distToLine = Math.abs(diff.y * dt.x - diff.x * dt.y) / length,
			distToCenter = hypot(middle.x - pt.x, middle.y - pt.y)
		return distToLine < maxDistToLine && distToCenter < maxDistFromCenter
	})
}

GestureParser.prototype.reduceLast = function(pts, size) {
	var arr = pts.slice(-size),
		begin = arr[0],
		end = arr[arr.length - 1],
		middle = middleOf(begin, end)
	return this.shouldReduce(arr) ?
		pts.slice(0, -size).concat(begin, middle, end) :
		pts
}

GestureParser.prototype.add = function(x, y) {
	var pts = this.pts,
		last = pts[pts.length - 1] || { x:-1, y:-1 }
	if (hypot(last.x - x, last.y - y) > this.opts.minDistanceToMove)
		this.pts.push({ x, y })
	if (this.pts.length >= this.opts.minPointsToReduce)
		this.pts = this.reduceLast(this.pts, this.opts.minPointsToReduce)
}

GestureParser.prototype.get = function() {
	var pts = this.pts
	for (var size = pts.length; size >= 3; size --)
		pts = this.reduceLast(pts, size)
	return pts
}

GestureParser.prototype.toString = function(slope) {
	var pts = this.get(),
		k = slope || this.opts.defaultParseSlope
	return pts.slice(1).reduce((str, _, i) => {
		var begin = pts[i], end = pts[i + 1],
			slope = (end.y - begin.y) / (end.x - begin.x),
			current = ''
		if (slope > k || slope < -k)
			current = end.y < begin.y ? '↑' : '↓'
		else if (slope < 1/k && slope > -1/k)
			current = end.x < begin.x ? '←' : '→'
		else if (end.y < begin.y)
			current = end.x < begin.x ? '↖' : '↗'
		else
			current = end.x < begin.x ? '↙' : '↘'
		return current != str.substr(-1) ? str + current : str
	}, '')
}

if (typeof module !== 'undefined')
	module.exports = GestureParser