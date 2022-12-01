class Material {
    constructor(gl, ambient, diffuse, specular, shininess, image_src) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.texture = gl.createTexture();

        const old_tex_binding = gl.getParameter( gl.TEXTURE_BINDING_2D );
        gl.bindTexture( gl.TEXTURE_2D, this.texture );

        gl.texImage2D(
            gl.TEXTURE_2D,
            0, gl.RGBA,
            256, 256, 0,
            gl.RGBA, gl.UNSIGNED_BYTE,
            Material.xor_texture()
        );
        gl.generateMipmap(gl.TEXTURE_2D);

        if( old_tex_binding === null ) {
            gl.bindTexture( gl.TEXTURE_2D, old_tex_binding );
        }

        let image = new Image();
        let _tex = this;

        image.addEventListener( 'load', function() {

            const old_tex_binding = gl.getParameter( gl.TEXTURE_BINDING_2D );
            gl.bindTexture( gl.TEXTURE_2D, _tex.tex );

            //Bind Texture
            gl.bindTexture(gl.TEXTURE_2D, _tex.texture);

            //Load pixels of loaded image
            gl.texImage2D(
                gl.TEXTURE_2D,
                0, gl.RGBA,
                gl.RGBA, gl.UNSIGNED_BYTE,
                image
            );
            gl.generateMipmap(gl.TEXTURE_2D);

            console.log( 'loaded texture: ', image.src );

            if( old_tex_binding === null ) {
                gl.bindTexture( gl.TEXTURE_2D, old_tex_binding );
            }
        });

        image.src = image_src;
    }

    bind(gl, program){
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        set_uniform_scalar(gl, program, 'mat_ambient', this.ambient);
        set_uniform_scalar(gl, program, 'mat_diffuse', this.diffuse);
        set_uniform_scalar(gl, program, 'mat_specular', this.specular);
        set_uniform_scalar(gl, program, 'mat_shininess', this.shininess);
        
    }

    static xor_texture(){
        let data = new Array(256 * 256 * 4);
    
        let width = 256;
    
        // create texture data
        for( let row = 0; row < width; row++){
            for(let col = 0; col < width; col++){
                let pix = (row * width + col) * 4;
                data[pix] = data[pix + 1] = data[pix + 2] = row ^ col;
                data[pix + 3] = 255;
            } 
        }
    
        return new Uint8Array(data);
    }
}