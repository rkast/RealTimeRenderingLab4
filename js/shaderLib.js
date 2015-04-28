var lab = {
	vertexShader : [
		"uniform mat4 modelMatrix, viewMatrix, projMatrix;",
		"attribute vec3 vPos;",
		"attribute vec3 vNormal;",
		"void main() {",
			"gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(vPos, 1.0);",

		"}"
	].join("\n"),

	fragmentShader : [
		"precision mediump float;",
		"uniform vec4 mColor;",
		"void main() {",
			"gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);",
		"}"
	].join("\n")
}
;
