// vertex shader
let vertex_source =
`   #version 300 es
precision mediump float;

uniform mat4 model;
uniform mat4 view;
uniform mat4 perspective;
uniform float mat_ambient;
uniform float mat_diffuse;
uniform float mat_specular;
uniform float mat_shininess;

uniform vec3 camera_pos;
uniform vec3 sun_dir;
uniform vec3 sun_color;

uniform vec3 point_light_dir;
uniform vec3 point_light_color;

in vec3 coordinates;
in vec4 color;
in vec2 uv;
in vec3 normal;

out vec4 v_color;
out vec2 v_uv;


vec3 diff_color(vec3 normal, vec3 light_dir, vec3 light_color, float mat_diffuse){
    return mat_diffuse * light_color * max( dot(normal, light_dir), 0.0);
}

vec3 spec_color(vec3 normal, vec3 light_dir, vec3 light_color, float mat_specular, float mat_shininess){
    float cos_light_surf_normal = max( 0.0, dot(normal, light_dir));
    if (cos_light_surf_normal <= 0.0) {
        return vec3(0.0,0.0,0.0);
    }

    vec3 light_dir_norm = normalize(light_dir);
    vec3 normal_norm = normalize(normal);
    vec3 camera_dir = normalize(camera_pos);

    vec3 R = 2.0 * (max( 0.0, dot(light_dir_norm, normal_norm))) * normal_norm - light_dir_norm;
    vec3 spec = mat_specular * pow(max(0.0, dot(R, camera_dir)), mat_shininess) * light_color;
    return spec;
}

void main(void){
    gl_Position = perspective * view * model * vec4( coordinates, 1.0 );
    float L = 1.0;

    vec3 sun_diff = diff_color( normal, sun_dir, sun_color, mat_diffuse );
    vec3 sun_spec = spec_color( normal, sun_dir, sun_color, mat_specular, mat_shininess );
    vec3 point_diff = diff_color( normal, point_light_dir, point_light_color, mat_diffuse );
    vec3 point_spec = spec_color( normal, point_light_dir, point_light_color, mat_specular, mat_shininess );
    vec4 ambient_color = vec4( mat_ambient, mat_ambient, mat_ambient, 1.0 );

    float dist = length(point_light_dir - coordinates);
    float attenuation = 1.0/(L * dist);

    v_color = (ambient_color + vec4(sun_diff, 1.0) + vec4(sun_spec, 1.0) +
        (vec4(point_diff, 1.0) + vec4(point_spec, 1.0)) * attenuation) * color;
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


let skybox_vert =
`   #version 300 es
layout (location = 0) in vec3 aPos;

precision mediump float;

uniform mat4 view;
uniform mat4 perspective;

out vec3 TexCoords;

void main(void){
    TexCoords = aPos;
    gl_Position = perspective * view * vec4(aPos, 1.0);
}
`;

let skybox_frag =
`   #version 300 es
precision mediump float;

in vec3 TexCoords;
uniform samplerCube cubemap;

out vec4 f_color;

void main(void){
    f_color = texture(cubemap, TexCoords);
}
`;