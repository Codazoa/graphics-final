const SKYBOX_STRIDE = 12

class Cubemap {
    constructor( gl, program, vertices, indices, material ) {
        this.verts = create_and_load_vertex_buffer( gl, vertices, gl.STATIC_DRAW );
        this.indis = create_and_load_elements_buffer( gl, indices, gl.STATIC_DRAW );
        
        this.n_verts = vertices.length;
        this.n_indis = indices.length;
        this.program = program;
        this.material = material;
        console.log(vertices)
        console.log(indices)
        console.log(this.n_indis)
    }

    render_skybox( gl, view, perspective, texture){
        if( texture ){
            gl.disable( gl.CULL_FACE );
            gl.depthFunc( gl.LEQUAL );
            
            gl.useProgram( this.program );
            gl.bindBuffer( gl.ARRAY_BUFFER, this.verts );
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indis );
            gl.bindTexture( gl.TEXTURE_CUBE_MAP, this.material );
            
            view = Cubemap.get_rot_view( view );
            set_uniform_matrix4(gl, this.program, "view", view.data );
            set_uniform_matrix4(gl, this.program, "perspective", perspective.data );
            
            set_vertex_attrib_to_buffer(
                gl, this.program, "coordinates", 
                this.verts, 3, gl.FLOAT, 
                false, SKYBOX_STRIDE, 0
            );

            gl.drawElements( gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0 );
            gl.enable( gl.CULL_FACE );
        }
    }

    static get_rot_view( view ){
        let data = [
            view.data[0], view.data[1], view.data[2],   0,
            view.data[4], view.data[5], view.data[6],   0,
            view.data[8], view.data[9], view.data[10],  0,
            0,            0,            0,              1
        ];

        return new Mat4( data );
    }
    
    static loadCubemap( gl, faces ){

        let textureID = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_CUBE_MAP, textureID );

        let cubemap_sides = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];

        let img = new Array(6);
        let count = 0;

        for( let i = 0; i < faces.length; i++){
            img[i] = new Image();
            gl.texImage2D(
                cubemap_sides[i],
                0, gl.RGBA,
                256, 256, 0,
                gl.RGBA, gl.UNSIGNED_BYTE,
                Material.xor_texture()
            );

            img[i].onload = function () {
                count++;
                if( count == 6 ) {
                    gl.bindTexture( gl.TEXTURE_CUBE_MAP, textureID );
                    for( let j = 0; j < faces.length; j++ ){
                        gl.texImage2D( cubemap_sides[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j] );
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        console.log( 'loaded: ', img[j].src );
                    }
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                }
            }
            img[i].src = faces[i];
        }

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE); 

        return textureID;
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

    static box( gl, program, width, height, depth, material ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            hwidth, -hheight, -hdepth,
            -hwidth, -hheight, -hdepth,
            -hwidth, hheight, -hdepth,
            hwidth, hheight, -hdepth,

            hwidth, -hheight, hdepth,
            -hwidth, -hheight, hdepth,
            -hwidth, hheight, hdepth,
            hwidth, hheight, hdepth,
        ];

        let indis = [
            // clockwise winding
            0, 1, 2, 2, 3, 0, 
            4, 0, 3, 3, 7, 4, 
            5, 4, 7, 7, 6, 5, 
            1, 5, 6, 6, 2, 1,
            3, 2, 6, 6, 7, 3,
            4, 5, 1, 1, 0, 4,

            // counter-clockwise winding
            // 0, 3, 2, 2, 1, 0,
            // 4, 7, 3, 3, 0, 4,
            // 5, 6, 7, 7, 4, 5,
            // 1, 2, 6, 6, 5, 1,
            // 3, 7, 6, 6, 2, 3,
            // 4, 0, 1, 1, 5, 4,
        ];

        return new Cubemap( gl, program, verts, indis, material );
    }
}