var VrmFingerPresets=function(){
	
	function registPreset(key,x,y,z){
		current[key]=new THREE.Vector3(x,y,z);
	}
	
	var presets={};
	presets["default"]={};
	
	
	
	var current={};
	current={};
	registPreset("leftMiddleProximal",0.00,2.55,74.56);
	registPreset("leftMiddleIntermediate",0.00,0.00,89.98);
	registPreset("leftMiddleDistal",0.00,0.00,82.10);
	registPreset("leftIndexProximal",0.00,0.00,79.00);
	registPreset("leftIndexIntermediate",0.00,0.00,90.00);
	registPreset("leftIndexDistal",0.00,0.00,90.00);
	registPreset("leftLittleProximal",0.00,14.75,89.64);
	registPreset("leftLittleIntermediate",0.00,0.00,89.92);
	registPreset("leftLittleDistal",0.00,0.00,81.55);
	registPreset("leftThumbProximal",-57.75,0.92,-16.04);
	registPreset("leftThumbIntermediate",-36.72,14.02,50.13);
	registPreset("leftThumbDistal",-35.62,27.35,20.40);
	registPreset("leftRingProximal",0.00,6.95,82.20);
	registPreset("leftRingIntermediate",0.00,0.00,89.99);
	registPreset("leftRingDistal",0.00,0.00,78.87);
	presets["goo"]=current;
	
	return presets;
}