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
		loadTexture:function(url,flipY){
			flipY=flipY==undefined?false:flipY;
			var texture=new THREE.TextureLoader().load(url);
			texture.flipY = false;
			texture.minFilter=THREE.LinearFilter;
			return texture;
		},isFingerBoneName:function(name){
			if(Mbl3dUtils.fingerBoneNames==undefined){
				Mbl3dUtils.fingerBoneNames=[];
				var lr=["L","R"];
				var fingerNames=["thumb","index","middle","ring","pinky"];
				var numbers=["00","01","02","03"];
				lr.forEach(function(side){
					fingerNames.forEach(function(name){
						numbers.forEach(function(number){
							var boneName=name+number+"_"+side;
							Mbl3dUtils.fingerBoneNames.push(boneName);
						})
					})
				});
				
				
			}
			for(var i=0;i<Mbl3dUtils.fingerBoneNames.length;i++){
				var finger=Mbl3dUtils.fingerBoneNames[i];
				if(name.endsWith(finger)){
					//console.log("match",name,finger);
					return true;
				}
			}
			
			return false;
		},isTwistBoneName:function(name){
			if(Mbl3dUtils.twistBoneNames==undefined){
				Mbl3dUtils.twistBoneNames=[];
				var lr=["L","R"];
				var fingerNames=["calf","thigh","lowerarm","upperarm"];
				
				lr.forEach(function(side){
					fingerNames.forEach(function(name){
							var boneName=name+"_twist_"+side;
							
							Mbl3dUtils.twistBoneNames.push(boneName);
						
					})
				});
				
				
			}
			for(var i=0;i<Mbl3dUtils.twistBoneNames.length;i++){
				var finger=Mbl3dUtils.twistBoneNames[i];
				if(name.endsWith(finger)){
					//console.log("match",name,finger);
					return true;
				}
			}
			
			return false;
		},isHasTwistBoneName:function(name){
			if(Mbl3dUtils.hasTwistBoneNames==undefined){
				Mbl3dUtils.hasTwistBoneNames=[];
				var lr=["L","R"];
				var fingerNames=["calf","thigh","lowerarm","upperarm"];
				
				lr.forEach(function(side){
					fingerNames.forEach(function(name){
							var boneName=name+"_"+side;
							Mbl3dUtils.hasTwistBoneNames.push(boneName);
						
					})
				});
			}
			for(var i=0;i<Mbl3dUtils.hasTwistBoneNames.length;i++){
				var finger=Mbl3dUtils.hasTwistBoneNames[i];
				if(name.endsWith(finger)){
					return true;
				}
			}
			
			return false;
		},
		convertToUnTwistBoneName:function(name){
			return name.replace("_twist_","_");
		},convertToTwistBoneName:function(name){
			if(!Mbl3dUtils.isHasTwistBoneName(name)){
				return name;
			}
			var name= name.replace("_R","_twist_R");
			return name= name.replace("_L","_twist_L");
		},isRootBoneName:function(name){
			return name.endsWith("root");
		}
}