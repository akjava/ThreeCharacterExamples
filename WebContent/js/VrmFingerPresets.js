var VrmFingerPresets=function(){
	
	function registPreset(key,x,y,z){
		current[key]=new THREE.Vector3(x,y,z);
	}
	
	var presets={};
	presets["default"]={};
	
	//finger order is ZYX
	
	var current={};
	current={};
	registPreset("leftMiddleProximal",0.00,6.80,74.56);
	registPreset("leftMiddleIntermediate",0.00,0.00,89.98);
	registPreset("leftMiddleDistal",0.00,0.00,82.10);
	registPreset("leftIndexProximal",0.00,14.40,79.00);
	registPreset("leftIndexIntermediate",0.00,0.00,90.00);
	registPreset("leftIndexDistal",0.00,0.00,90.00);
	registPreset("leftLittleProximal",0.00,-5.80,89.64);
	registPreset("leftLittleIntermediate",0.00,0.00,89.92);
	registPreset("leftLittleDistal",0.00,0.00,81.55);
	registPreset("leftThumbProximal",-56.89,-0.59,-12.67);
	registPreset("leftThumbIntermediate",-25.77,23.08,33.08);
	registPreset("leftThumbDistal",-24.47,39.03,18.92);
	registPreset("leftRingProximal",0.00,0.00,82.20);
	registPreset("leftRingIntermediate",0.00,0.00,89.99);
	registPreset("leftRingDistal",0.00,0.00,78.87);
	presets["goo"]=current;
	
	return presets;
}