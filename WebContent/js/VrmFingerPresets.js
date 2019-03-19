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
	
	current={};
	registPreset("leftIndexProximal",0.00,8.03,0.00);
	registPreset("leftIndexIntermediate",0.00,0.00,0.01);
	registPreset("leftIndexDistal",0.00,0.00,0.10);
	registPreset("leftLittleProximal",0.00,-11.17,0.00);
	registPreset("leftLittleDistal",0.00,0.00,0.00);
	registPreset("leftThumbProximal",-12.14,26.87,-10.72);
	registPreset("leftThumbIntermediate",2.63,7.00,7.69);
	registPreset("leftThumbDistal",7.01,10.59,5.25);
	registPreset("leftRingProximal",0.00,-6.08,0.00);
	registPreset("leftRingDistal",0.00,0.00,0.00);
	presets["flat"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,-2.89,-5.25);
	registPreset("leftMiddleIntermediate",0.00,0.00,28.22);
	registPreset("leftMiddleDistal",0.00,0.00,44.67);
	registPreset("leftIndexProximal",0.00,10.73,9.00);
	registPreset("leftIndexIntermediate",0.00,0.00,14.92);
	registPreset("leftIndexDistal",0.00,0.00,42.46);
	registPreset("leftLittleProximal",0.00,-29.77,31.36);
	registPreset("leftLittleIntermediate",0.00,0.00,0.00);
	registPreset("leftLittleDistal",0.00,0.00,8.31);
	registPreset("leftThumbProximal",-76.01,3.46,-35.84);
	registPreset("leftThumbIntermediate",2.47,-4.06,2.82);
	registPreset("leftThumbDistal",6.24,0.14,5.57);
	registPreset("leftRingProximal",0.00,-15.74,9.47);
	registPreset("leftRingIntermediate",0.00,0.00,26.51);
	registPreset("leftRingDistal",0.00,0.00,24.59);
	presets["kosaji"]=current;
	return presets;
}