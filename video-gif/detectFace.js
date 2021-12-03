const cv = require('opencv4nodejs');



const image = cv.imread('png/thumb0001.png');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

// detect faces
const { objects, numDetections } = classifier.detectMultiScale(image.bgrToGray());
console.log('faceRects:', objects);
console.log('confidences:', numDetections);

if (!objects.length) {
	throw new Error('No faces detected!');
}

// draw detection
const numDetectionsTh = 10;
objects.forEach((rect, i) => {
	const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
	drawBlueRect(image, rect, thickness);
});

cv.imshowWait('face detection', image);

function drawRect (image, rect, color, thickness) {
	return image.drawRectangle(
		rect,
		color,
		thickness,
		cv.LINE_8
	);
}

function drawBlueRect (image, rect, thickness) {
	return drawRect(image, rect, new cv.Vec3(255, 0, 0), thickness);
}