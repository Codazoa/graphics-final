class Material {
    constructor(gl, program, ambient, diffuse, specular, shininess, tex_image){
        this.tex = gl.createTexture();
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = shininess;
        this.image = new Image();
        
        gl.bindTexture( gl.TEXTURE_2D, this.tex );

        gl.texImage2D( 
            gl.TEXTURE_2D, 0, gl.RGBA,
            256, 256, 0,
            gl.RGBA, gl.UNSIGNED_BYTE,
            xor_texture(256)
        );
        gl.generateMipmap( gl.TEXTURE_2D );

        this.image.onload = function () {
            gl.bindTexture( gl.TEXTURE_2D, tex );
            gl.texImage2D( 
                gl.TEXTURE_2D, 0, gl.RGBA,
                gl.RGBA, gl.UNSIGNED_BYTE,
                this.image
            );
            gl.generateMipmap( gl.TEXTURE_2D );
        };

        image.src = tex_image;

        set_uniform_scalar( gl, program, 'mat_ambient', ambient );
        set_uniform_scalar( gl, program, 'mat_diffuse', diffuse ); 
        set_uniform_scalar( gl, program, 'mat_specular', specular );
        set_uniform_scalar( gl, program, 'mat_shininess', shininess );
    }
}