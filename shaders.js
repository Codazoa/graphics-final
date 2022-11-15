// vertex shader
let vertex_source =
`   #version 300 es
precision mediump float;

uniform mat4 modelview;

in vec3 coordinates;
in vec4 color;
in vec2 uv;

out vec4 v_color;
out vec2 v_uv;

void main(void){
    gl_Position = modelview * vec4( coordinates, 1.0 );
    v_color = color;
    v_uv = uv;
}
`;

// fragment shader
let fragment_source =
`   #version 300 es
precision mediump float;

uniform sampler2D tex_0;

in vec4 v_color;
in vec2 v_uv;

out vec4 f_color;

void main(void){
    f_color = texture( tex_0, v_uv ) * v_color;
}
`;