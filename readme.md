# simple gesture parser
convert positions to directions

### example and usage
see the index.html for a live example
```javascript
var gesture = new GestureParser({
	// should be between 0 and 1
	// more segments will be returned with a smaller value
	maxDistToLineScale: 0.13,

	// should be greater than 0.5
	// used to distinguish "→" and "→←"
	maxDistToCenterScale: 0.55,

	// should be greater than 1
	// used to distinguish directions like "→", "↗" and "↘"
	defaultParseSlope: 2.5,

	// point will be ignore if distance to the last added one is less than 5
	minDistanceToMove: 3,

	// will try to reduce when there has been more than 8 points
	minPointsToReduce: 5,
})

// add positions
gesture.add(0, 10)
gesture.add(0, 15)
gesture.add(0, 20)
gesture.add(0, 25)
gesture.add(0, 30)
gesture.add(5, 30)
gesture.add(10, 30)
gesture.add(15, 30)
gesture.add(20, 30)

// two segments will be returned
assert.deepEqual(gesture.get(), [
	{ x:0, y:10 },  // begining of segment 1
	{ x:0, y:20 },  // center of segment 1
	{ x:0, y:30 },  // end of segment 1 & begining of segment 2
	{ x:10, y:30 }, // center of segment 2
	{ x:20, y:30 }, // end of segment 2
])

// will return DOWN-RIGHT
assert.equal(gesture.toString(), '↓→')
```