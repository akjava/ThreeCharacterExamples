var Mbl3dUtils={
		convertOptionsToMbl3d:function(options){
			var newOptions={};
			Object.keys(options).forEach(function(key){
				var value=options[key];

				newOptions[key]=Mbl3dUtils.shortenMbl3dBoneName(value);
			});
			
			return newOptions;
		},
		shortenMbl3dBoneName:function(name){
			
			var splitted=name.split("_");
			
			var shorten=null;
			if(splitted.length==4){
				shorten=splitted[splitted.length-2]+"_"+splitted[splitted.length-1];
			}else if(splitted.length==5){
				shorten=splitted[splitted.length-3]+"_"+splitted[splitted.length-2]+"_"+splitted[splitted.length-1];
			}else{
				shorten=splitted[splitted.length-1]
			}
			return shorten;
		},
		loadTexture:function(url){
			var texture=new THREE.TextureLoader().load(url);
			texture.flipY = false;
			texture.minFilter=THREE.LinearFilter;
			return texture;
		}
}