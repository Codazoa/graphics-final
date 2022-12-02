const SKYBOX_STRIDE = 12

class Cubemap {
    constructor( gl, program, vertices, indices, material ) {
        this.verts = create_and_load_vertex_buffer( gl, vertices, gl.STATIC_DRAW );
        this.indis = create_and_load_elements_buffer( gl, indices, gl.STATIC_DRAW );

        this.n_verts = vertices.length;
        this.n_indis = indices.length;
        this.program = program;
        this.material = material;
    }

    render( gl, view, perspective ){
        gl.depthMask( false );
        gl.useProgram( this.program );

        set_uniform_matrix4(gl, this.program, "view", view.data );
        set_uniform_matrix4(gl, this.program, "perspective", perspective.data );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.verts );
        gl.bindTexture( gl.TEXTURE_CUBE_MAP, this.material );

        gl.drawArrays( gl.TRIANGLES, 0, 24);

        gl.depthMask( true );
    }

    static box_six_sided( gl, program, width, height, depth, material ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            // front
            hwidth, -hheight, -hdepth,
            -hwidth, -hheight, -hdepth,
            -hwidth, hheight, -hdepth,
            hwidth, hheight, -hdepth,

            // right
            hwidth, -hheight, hdepth,
            hwidth, -hheight, -hdepth,
            hwidth, hheight, -hdepth,
            hwidth, hheight, hdepth,

            // back
            -hwidth, -hheight, hdepth,
            hwidth, -hheight, hdepth,
            hwidth, hheight, hdepth,
            -hwidth, hheight, hdepth,

            // left
            -hwidth, -hheight, -hdepth,
            -hwidth, -hheight, hdepth,
            -hwidth, hheight, hdepth,
            -hwidth, hheight, -hdepth,

            // top
            hwidth, hheight, -hdepth, 
            -hwidth, hheight, -hdepth,
            -hwidth, hheight, hdepth, 
            hwidth, hheight, hdepth,  

            // bottom
            hwidth, -hheight, -hdepth, 
            -hwidth, -hheight, -hdepth,
            -hwidth, -hheight, hdepth, 
            hwidth, -hheight, hdepth,  
        ];

        let indis = [
            // counter-clockwise winding
            0, 3, 2, 2, 1, 0,
            4, 7, 6, 6, 5, 4,
            8, 11, 10, 10, 9, 8,
            12, 15, 14, 14, 13, 12,
            16, 19, 18, 18, 17, 16,
            21, 22, 23, 23, 20, 21,            
        ];

        return new Cubemap( gl, program, verts, indis, material);
    }

    static loadCubemap( gl, faces ){
        let textureID = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_CUBE_MAP, textureID );
        
        let img = new Array(6);
        let count = 0;
        for( let i = 0; i < 6; i++ ){
            img[i] = new Image();
            img[i].onload = function() {
                count++
                if( count == 6 ){
                    let cubemap_sides = [
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                    ]
                    
                    for(let j = 0; j < 6; j++ ){
                        gl.texImage2D(
                            cubemap_sides[j],
                            0, gl.RGBA, 
                            256, 256, 0,
                            gl.RGBA, gl.UNSIGNED_BYTE,
                            img[j]
                            );
                    }
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
                }
                    gl.generateMipmap ( gl.TEXTURE_CUBE_MAP );
            }
                
                img[i].src = faces[i];
        }

        return textureID;
    }
}