class SceneLoader {
    static readStringFromFileAtPath(path) {
        let request = new XMLHttpRequest();
        request.open("GET", path, false);
        request.send(null);
        let returnValue = request.responseText;

        return returnValue;
    }

    static loadJSON(path){
        return JSON.parse(SceneLoader.readStringFromFileAtPath(path));
    }

    static loadMaterial(gl, obj ){
        return new Material(gl, obj['ambient'], obj['specular'], obj['diffuse'], obj['shininess'], obj['image_src']);
    }

    static loadMesh(gl, program, obj, materials){
        return Mesh[obj['mesh']](gl, program, obj['options'], this.mats[obj['material']]);
    }

    static create_graph( obj, scene_meshes ){
        
    }

    static loadAnim( obj, scene_objects ){
        scene_objects[obj]
    }
}