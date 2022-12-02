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

uniform vec3 point_light_pos[8];
uniform vec3 point_light_color[8];

in vec3 coordinates;
in vec4 color;
in vec2 uv;
in vec3 normal;

out vec4 v_color;
out vec2 v_uv;

vec3 direction(vec3 object_coords, vec3 other_coords
){
    return normalize(other_coords - object_coords);
}

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

float pl_distance(
    vec3 object_coords,
    vec3 light_coords
){
    vec3 dist_vec = object_coords - light_coords;
    return sqrt(pow(dist_vec.x, 2.0) + pow(dist_vec.y, 2.0) + pow(dist_vec.z, 2.0));
}

float pl_attenuation(
    vec3 object_coords,
    vec3 light_coords
){
    float K = 0.5;
    float L = 1.0;
    float Q = 0.1; 
    float d = pl_distance(object_coords, light_coords);

    return 1.0 / (K + (L * d) + (Q * pow(d, 2.0)));   
}

void main(void){
    gl_Position = perspective * view * model * vec4( coordinates, 1.0 );
    float L = 1.0;

    vec3 sun_diff = diff_color( normal, sun_dir, sun_color, mat_diffuse );
    vec3 sun_spec = spec_color( normal, sun_dir, sun_color, mat_specular, mat_shininess );

    vec3 point_diff = vec3(0, 0, 0);
    vec3 point_spec = vec3(0, 0, 0);
    float attenuation = 0.0;

    vec3 coords_tx = (model * vec4(coordinates, 1.0)).xyz;
    vec3 normal_tx = normalize(mat3(model) * normal);
    for (int i = 0; i < 8; i++) {
        
        vec3 dir = direction(coords_tx, point_light_pos[i]);

        point_diff += diff_color( normal_tx, dir, point_light_color[i], mat_diffuse );
        point_spec += spec_color( normal_tx, dir, point_light_color[i], mat_specular, mat_shininess );

        attenuation += pl_attenuation(coords_tx, point_light_pos[i]);
    }

    vec4 ambient_color = vec4( mat_ambient, mat_ambient, mat_ambient, 1.0 );

    v_color = (ambient_color + vec4(sun_diff, 1.0) + vec4(sun_spec, 1.0) +
        (vec4(point_diff, 1.0) + vec4(point_spec, 1.0)) * attenuation) * color;
    v_uv = uv;
}
`

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