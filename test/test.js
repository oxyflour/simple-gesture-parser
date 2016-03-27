var assert = require('assert'),
	GestureParser = require('../index')

describe('test parser', function() {

	it('should make a simple gesture', function() {
		var gesture = new GestureParser()

		gesture.add(0, 10)
		gesture.add(0, 20)
		gesture.add(0, 30)
		gesture.add(0, 40)
		gesture.add(0, 50)

		assert.deepEqual(gesture.get(), [
			{ x:0, y:10 },
			{ x:0, y:30 },
			{ x:0, y:50 },
		])

		assert.equal(gesture.toString(), '↓')
	})

	it('should make a compose gesture', function() {
		var gesture = new GestureParser()
		
		gesture.add(0, 10)
		gesture.add(0, 15)
		gesture.add(0, 20)
		gesture.add(0, 25)
		gesture.add(0, 30)
		gesture.add(5, 30)
		gesture.add(10, 30)
		gesture.add(15, 30)
		gesture.add(20, 30)

		assert.deepEqual(gesture.get(), [
			{ x:0, y:10 },
			{ x:0, y:20 },
			{ x:0, y:30 },
			{ x:10, y:30 },
			{ x:20, y:30 },
		])

		assert.equal(gesture.toString(), '↓→')
	})

})
