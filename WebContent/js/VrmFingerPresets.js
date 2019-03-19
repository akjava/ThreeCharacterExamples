var VrmFingerPresets=function(){
	
	function registPreset(key,x,y,z){
		current[key]=new THREE.Vector3(x,y,z);
	}
	
	var presets={};
	presets["default"]={};
	
	
	
	var current={};
	registPreset("leftIndexProximal",0,0,80);
	registPreset("leftIndexIntermediate",0,0,75);
	registPreset("leftIndexDistal",0,0,60);
	presets["goo"]=current;
	
	return presets;
}