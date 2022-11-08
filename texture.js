class Textures {
    constructor( texture ) {
        if ( texture == null ) {
            this.texture = xor_texture();
        }
        else {
            this.texture = texture;
        }
    }

}
function xor_texture(width){
    let data = new Array( 256 * 256 * 4 );
    for( let row = 0; row < width; row++ ) {
        for( let col = 0; col < width; col++ ){
            let pix = ( row * width + col ) * 4;
            data[pix] = data[pix+1] = data[pix+2] = row ^ col;
            data[pix+3] = 255;
        }
    }


    return new Uint8Array( data )
}