attribute vec2 POSITION;

void main(void) {
	gl_Position = vec4(POSITION, 0., 1.);
}