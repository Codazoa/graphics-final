
const VERTEX_STRIDE = 48;
const TAU = 2 * Math.PI;

class Mesh {
    /** 
     * Creates a new mesh and loads it into video memory.
     * 
     * @param {WebGLRenderingContext} gl  
     * @param {number} program
     * @param {number[]} vertices
     * @param {number[]} indices
    */
    constructor( gl, program, vertices, indices ) {
        this.verts = create_and_load_vertex_buffer( gl, vertices, gl.STATIC_DRAW );
        this.indis = create_and_load_elements_buffer( gl, indices, gl.STATIC_DRAW );

        this.n_verts = vertices.length;
        this.n_indis = indices.length;
        this.program = program;
    }

    /**
     * Create a box mesh with the given dimensions and colors.
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {number} depth 
     */

    static box( gl, program, width, height, depth ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,
            hwidth, hheight, -hdepth,       1.0, 1.0, 1.0, 1.0,

            hwidth, -hheight, hdepth,       1.0, 1.0, 0.0, 1.0,
            -hwidth, -hheight, hdepth,      0.0, 0.0, 0.0, 1.0,
            -hwidth, hheight, hdepth,       1.0, 0.0, 1.0, 1.0,
            hwidth, hheight, hdepth,        0.0, 1.0, 1.0, 1.0,
        ];

        let indis = [
            // clockwise winding
            /*
            0, 1, 2, 2, 3, 0, 
            4, 0, 3, 3, 7, 4, 
            5, 4, 7, 7, 6, 5, 
            1, 5, 6, 6, 2, 1,
            3, 2, 6, 6, 7, 3,
            4, 5, 1, 1, 0, 4,
            */

            // counter-clockwise winding
            0, 3, 2, 2, 1, 0,
            4, 7, 3, 3, 0, 4,
            5, 6, 7, 7, 4, 5,
            1, 2, 6, 6, 5, 1,
            3, 7, 6, 6, 2, 3,
            4, 0, 1, 1, 5, 4,
        ];

        return new Mesh( gl, program, verts, indis );
    }

    static make_uv_sphere( gl, program, subdivs, material ) {
        let verts = [];
        let indis = [];

        // generating verts
        for( let layer = 0; layer <= subdivs; layer++ ) {
            let y_turns = layer / subdivs / 2;
            let y = Math.cos( y_turns * TAU ) / 2;

            for( let subdiv = 0; subdiv <= subdivs; subdiv++ ) {
    
                let turns = subdiv / subdivs;
                let rads = turns * TAU;

                let x = (Math.cos( rads ) / 2) * Math.sqrt( 1 - Math.pow( 2*y, 2 ));
                let z = (Math.sin( rads ) / 2) * Math.sqrt( 1 - Math.pow( 2*y, 2 ));
    
                verts.push( x, y, z );
                verts.push( 1, 1, 1, 1 );
    
                let u = subdiv / subdivs;
                let v = layer / subdivs;
    
                verts.push( u, v );

                let norm = new Vec4(x, y, z, 1);
                norm = norm.norm();

                verts.push(norm.x, norm.y, norm.z);
            }
        }

        // generating indis
        for( let layer = 0; layer < subdivs; layer++ ) {
            let layer_start_vert = layer * subdivs + layer;

            for( let subdiv = 0; subdiv < subdivs; subdiv++ ) {
                // calculate the 2 triangles
                let current_vert = layer_start_vert + subdiv;
                let next_layer_vert = current_vert + subdivs + 1;
                let i0 = next_layer_vert;
                let i1 = i0 + 1;
                let i2 = current_vert + 1;
                indis.push( current_vert, i0, i1, i1, i2, current_vert);
            }
        }

        return new Mesh( gl, program, verts, indis );
    }

    // create a box with completely separeate faces
    static box_six_sided( gl, program, width, height, depth ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            // front
            hwidth, -hheight, -hdepth,      1.0, 1.0, 1.0, 1.0,     0.25, 0.5,  // 0    F0
            -hwidth, -hheight, -hdepth,     1.0, 1.0, 1.0, 1.0,     0.0,  0.5,  // 1    F1
            -hwidth, hheight, -hdepth,      1.0, 1.0, 1.0, 1.0,     0.0,  0.25, // 2    F2
            hwidth, hheight, -hdepth,       1.0, 1.0, 1.0, 1.0,     0.25, 0.25, // 3    F3

            // right
            hwidth, -hheight, hdepth,       1.0, 1.0, 1.0, 1.0,     0.5,  0.5,  // 4    R0
            hwidth, -hheight, -hdepth,      1.0, 1.0, 1.0, 1.0,     0.25, 0.5,  // 5    R1
            hwidth, hheight, -hdepth,       1.0, 1.0, 1.0, 1.0,     0.25, 0.25, // 6    R2
            hwidth, hheight, hdepth,        1.0, 1.0, 1.0, 1.0,     0.5,  0.25, // 7    R3

            // back
            -hwidth, -hheight, hdepth,      1.0, 1.0, 1.0, 1.0,     0.75, 0.5,  // 8    B0
            hwidth, -hheight, hdepth,       1.0, 1.0, 1.0, 1.0,     0.5,  0.5,  // 9    B1
            hwidth, hheight, hdepth,        1.0, 1.0, 1.0, 1.0,     0.5,  0.25, // 10   B2
            -hwidth, hheight, hdepth,       1.0, 1.0, 1.0, 1.0,     0.75, 0.25, // 11   B3

            // left
            -hwidth, -hheight, -hdepth,     1.0, 1.0, 1.0, 1.0,     1.0,  0.5,  // 12   L0
            -hwidth, -hheight, hdepth,      1.0, 1.0, 1.0, 1.0,     0.75, 0.5,  // 13   L1
            -hwidth, hheight, hdepth,       1.0, 1.0, 1.0, 1.0,     0.75, 0.25, // 14   L2
            -hwidth, hheight, -hdepth,      1.0, 1.0, 1.0, 1.0,     1.0,  0.25, // 15   L3

            // top
            hwidth, hheight, -hdepth,       1.0, 1.0, 1.0, 1.0,     0.75, 0.25, // 16   t0
            -hwidth, hheight, -hdepth,      1.0, 1.0, 1.0, 1.0,     0.5,  0.25, // 17   t1
            -hwidth, hheight, hdepth,       1.0, 1.0, 1.0, 1.0,     0.5,  0.0,  // 18   t2
            hwidth, hheight, hdepth,        1.0, 1.0, 1.0, 1.0,     0.75, 0.0,  // 19   t3

            // bottom
            hwidth, -hheight, -hdepth,      1.0, 1.0, 1.0, 1.0,     0.75, 0.75, // 20   b0
            -hwidth, -hheight, -hdepth,     1.0, 1.0, 1.0, 1.0,     0.5,  0.75, // 21   b1
            -hwidth, -hheight, hdepth,      1.0, 1.0, 1.0, 1.0,     0.5,  0.5,  // 22   b2
            hwidth, -hheight, hdepth,       1.0, 1.0, 1.0, 1.0,     0.75, 0.5,  // 23   b3
        ];

        let indis = [
            // clockwise winding
            /*
            0, 1, 2, 2, 3, 0, 
            4, 0, 3, 3, 7, 4, 
            5, 4, 7, 7, 6, 5, 
            1, 5, 6, 6, 2, 1,
            3, 2, 6, 6, 7, 3,
            4, 5, 1, 1, 0, 4,
            */

            // counter-clockwise winding
            0, 3, 2, 2, 1, 0,
            4, 7, 6, 6, 5, 4,
            8, 11, 10, 10, 9, 8,
            12, 15, 14, 14, 13, 12,
            16, 19, 18, 18, 17, 16,
            21, 22, 23, 23, 20, 21,            
        ];

        return new Mesh( gl, program, verts, indis );
    }


    /**
     * Render the mesh. Does NOT preserve array/index buffer or program bindings! 
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render( gl ) {
        gl.cullFace( gl.BACK );
        gl.enable( gl.CULL_FACE );
        
        gl.useProgram( this.program );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indis );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "coordinates", 
            this.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 0 
        );
        
        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "color", 
            this.verts, 4, 
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "uv",
            this.verts, 2,
            gl.FLOAT, false, VERTEX_STRIDE, 28
        );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "normal",
            this.verts, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 36
        );

        gl.drawElements( gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0 );
    }

    /**
     * Parse the given text as the body of an obj file.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} text
     */
    static from_obj_text( gl, program, text ) {
        // create verts and indis from the text 
		
		let verts = []
		let indis = []

		// YOUR CODE GOES HERE 
        let lines = text.split(/\r?\n/);
        lines.forEach(line => {
            line = line.trim();
            let parts_of_line = line.split(/(\s)/);

            // if vertex line, push the values onto verts
            if ( parts_of_line[0] == 'v' ) {
                parts_of_line.slice(1, parts_of_line.length).forEach(val => {
                    if ( val != " " ) {
                        verts.push(val)
                    }
                });
                // push the vertex color information
                verts.push( 0.0, 0.0, 0.0, 1.0 );
            }
            // if face line, push values onto indis
            else if ( parts_of_line[0] == 'f' ) {
                parts_of_line.slice(1, parts_of_line.length).forEach(val => {
                    if ( val != " " ) {
                        indis.push( val - 1 ); // faces start indexing at 1 for some reason
                    }
                });
            }
        });
        return new Mesh( gl, program, verts, indis );
    }

    /**
     * Asynchronously load the obj file as a mesh.
     * @param {WebGLRenderingContext} gl
     * @param {string} file_name 
     * @param {WebGLProgram} program
     * @param {function} f the function to call and give mesh to when finished.
     */
    static from_obj_file( gl, file_name, program, f ) {
        let request = new XMLHttpRequest();
        
        // the function that will be called when the file is being loaded
        request.onreadystatechange = function() {
            // console.log( request.readyState );

            if( request.readyState != 4 ) { return; }
            if( request.status != 200 ) { 
                throw new Error( 'HTTP error when opening .obj file: ', request.statusText ); 
            }

            // now we know the file exists and is ready
			// load the file 
            let loaded_mesh = Mesh.from_obj_text( gl, program, request.responseText );

            console.log( 'loaded ', file_name );
            f( loaded_mesh );
        };

        
        request.open( 'GET', file_name ); // initialize request. 
        request.send();                   // execute request
    }
}