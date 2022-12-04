function update() {
            
    // update camera
    listener.keys_down_list().forEach( key => {
        if( key in key_bindings ) {
            key_bindings[key]();
        }
    });

    set_uniform_vec3_array( gl, shader_program, 'camera_pos', [camera.x, camera.y, camera.z]);
        

    // earth_pos.add_yaw(0.5 * DELTA_T);
    // earth_arm.add_roll(0.25 * DELTA_T);

    orb_axle.add_yaw(0.2 * DELTA_T);

    chase_cam.move_in_direction(0,0,FORWARD);
    chase_cam.add_pitch(-0.00005);


    orb.add_yaw(0.2 * DELTA_T);
    
    ground_pos.add_pitch(0.01 * DELTA_T/3);

    fl_wheel.add_pitch(-1 * DELTA_T );
    fr_wheel.add_pitch(-1 * DELTA_T );
    br_wheel.add_pitch(-1 * DELTA_T );
    bl_wheel.add_pitch(-1 * DELTA_T );

    moonA_arm.add_yaw(0.4 * DELTA_T);
    moonA_arm.add_pitch(0.2 * DELTA_T);

    moonB_arm.add_roll(0.4 * DELTA_T);
    moonB_arm.add_yaw(0.2 * DELTA_T);

    moonC_arm.add_pitch(0.4 * DELTA_T);
    moonC_arm.add_roll(0.2 * DELTA_T);


    orb1.add_yaw(0.2 * DELTA_T);
    

    moon1A_arm.add_yaw(0.4 * DELTA_T);
    moon1A_arm.add_pitch(0.2 * DELTA_T);

    moon1B_arm.add_roll(0.4 * DELTA_T);
    moon1B_arm.add_yaw(0.2 * DELTA_T);

    moon1C_arm.add_pitch(0.4 * DELTA_T);
    moon1C_arm.add_roll(0.2 * DELTA_T);


    orb2.add_yaw(0.2 * DELTA_T);
    

    moon2A_arm.add_yaw(0.4 * DELTA_T);
    moon2A_arm.add_pitch(0.2 * DELTA_T);

    moon2B_arm.add_roll(0.4 * DELTA_T);
    moon2B_arm.add_yaw(0.2 * DELTA_T);

    moon2C_arm.add_pitch(0.4 * DELTA_T);
    moon2C_arm.add_roll(0.2 * DELTA_T);

    let jobs = [];
    let lights = [];
    scene.generate_render_batch(jobs, lights);

    perspective = Mat4.perspective( FOV, ASPECT_RATIO, NEAR, FAR );
    view = camera.get_view_matrix();

    set_uniform_matrix4(gl, shader_program, "view", view.data);
    set_uniform_matrix4(gl, shader_program, "perspective", perspective.data);
}