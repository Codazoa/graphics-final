// initializing render function
function render( now ){
    
    // clear screen
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    let jobs = [];
    let lights = [];
    scene.generate_render_batch(jobs, lights);
    
    gl.useProgram( shader_program );
    for (let i = 0; i < jobs.length; i++) {
        set_uniform_matrix4(gl, shader_program, "model", jobs[i].matrix.data);
        
        if (jobs[i].mesh != null){
            if(debounce){
                debounce = false;
            }
            // console.log('mesh should render');
            
            jobs[i].mesh.material.bind(gl, shader_program);
            jobs[i].mesh.render(gl);
        }  else {
            // console.log('mesh not loaded')
        };
        
        
    }
    let light_locs = [];
    let light_colors = [];
    for (let i = 0; i < 8; i++) {

        if (lights[i] != null){
            light_locs[i] = [lights[i].loc.x, lights[i].loc.y, lights[i].loc.z];
            light_colors[i] = [lights[i].color.r, lights[i].color.g, lights[i].color.b];
        } else {
            // break;
            light_locs[i] = [0, 0, 0];
            light_colors[i] = [0, 0, 0];
        }
        set_uniform_vec3_array(gl, shader_program, "point_light_pos["+i.toString()+"]",  light_locs[i]);
        set_uniform_vec3_array(gl, shader_program, "point_light_color["+i.toString()+"]", light_colors[i]);
    }
    // set_uniform_vec3_array(gl, shader_program, "point_light_dir["+i.toString()+"]",  light_locs[0]);
    // set_uniform_vec3_array(gl, shader_program, "point_light_color["+i.toString()+"]", light_colors[0]);

    skybox.render_skybox( gl, view, perspective, skybox_tex);
    gl.useProgram( shader_program ); 

    requestAnimationFrame( render );
}