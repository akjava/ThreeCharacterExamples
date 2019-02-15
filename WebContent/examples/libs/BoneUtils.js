var BoneUtils={
		/*
		 * dont forget set parent
		 */
		createBone:function(){
			var bone={pos:[0,0,0],scl:[1,1,1],rotq:[0,0,0,1]};
			return bone;
		},
		createBonesFromPoints:function(positions,slices){
			var separator="-";
			var bones=[];
			var root=BoneUtils.createBone();
			root.parent=-1;
			root.name="root";
			bones.push(root);
			
			var horizontalVertexCount=slices+1;
			var verticalVertexCount=positions.length/horizontalVertexCount;
			
			//set average
			var rootPos=new THREE.Vector3();
			for(var i=0;i<horizontalVertexCount;i++){
				rootPos.add(positions[i]);
			}
			rootPos.divideScalar(horizontalVertexCount);
			root.pos=rootPos.toArray();
			
			var boneIndex=1;//index 0 added above
			for(var i=0;i<horizontalVertexCount;i++){
				var parent=0;
				var parentPos=rootPos.clone();
				
				for(var j=0;j<verticalVertexCount;j++){
					
					var ind=(horizontalVertexCount)*j+i;
					
					var position=positions[ind];
					
					var childBone=BoneUtils.createBone();
					childBone.parent=parent;
					childBone.name=i+separator+(j);
					
					childBone.pos=position.clone().sub(parentPos).toArray();
					bones.push(childBone);
					
					parent=boneIndex;
					boneIndex++;
					parentPos=position;
					
				}
				
			}
			
			return bones;
		},
		initializeIndicesAndWeights:function(geometry,index){
			if(!geometry){
				console.error("initializeIndicesAndWeights:geometry undefined or null");
				return;
			}
			if ( !  geometry.isGeometry  ) {
				console.error("initializeIndicesAndWeights:geometry only support Normal Geometry");
				return;
			}
			index=index!==undefined?index:0;
			geometry.skinIndices=[];
			geometry.skinWeights=[];
			for(var j=0;j<geometry.vertices.length;j++){
				geometry.skinIndices.push(new THREE.Vector4(index,0,0,0));
				geometry.skinWeights.push(new THREE.Vector4(1.0,0,0,0));
			}
		},
		copyIndicesAndWeights:function(fromGeo,toGeo){
			if(!fromGeo){
				console.error("copyIndicesAndWeights:fromGeo undefined or null");
			}
			if(!toGeo){
				console.error("copyIndicesAndWeights:toGeo undefined or null");
			}
			if ( !  toGeo.isGeometry  ) {
				console.error("copyIndicesAndWeights:toGeo only support Normal Geometry");
			}
			
			toGeo.skinIndices=[];
			toGeo.skinWeights=[];
			
			if(fromGeo.isGeometry){
				for(var j=0;j<fromGeo.skinIndices.length;j++){
					toGeo.skinIndices.push(fromGeo.skinIndices[i].clone());
					toGeo.skinWeights.push(fromGeo.skinWeights[i].clone());
				}
			}else if(fromGeo.isBufferGeometry){
				var attributes=fromGeo.attributes;
				var indices = attributes.skinIndex.array;
				var weights = attributes.skinWeight.array;
				for ( var i = 0; i < indices.length; i += 4 ) {
					toGeo.skinIndices.push(new THREE.Vector4( indices[ i ], indices[ i + 1 ], indices[ i + 2 ],indices[i+3] ));
					toGeo.skinWeights.push(new THREE.Vector4( weights[ i ], weights[ i + 1 ], weights[ i + 2 ],weights[i+3] ));
				}
				
			}else{
				console.error("copyIndicesAndWeights:toGeo is not Geometry nor BufferGeometry");
			}
			
			
		},
		copyMorphTargets:function(fromGeo,toGeo){
			try{
				
			
			if(!fromGeo){
				console.error("copyMorphTargets:fromGeo undefined or null");
			}
			if(!toGeo){
				console.error("copyMorphTargets:toGeo undefined or null");
			}
			if ( !  toGeo.isGeometry  ) {
				console.error("copyMorphTargets:toGeo only support Normal Geometry");
			}
			
			
			
			if(fromGeo.isGeometry){
				console.error("copyMorphTargets:fromGeo only support Buffered Geometry so far");
			}else if(fromGeo.isBufferGeometry){
				
				var morphAttributes=fromGeo.morphAttributes;
				if(morphAttributes.position==undefined){
					return;
				}
				var poses=morphAttributes.position;
				
				toGeo.morphTargets=[];
				
				poses.forEach(function(attribute){
					var name=attribute.name;
					var count=attribute.count;
					var array=attribute.array;
					
					var target={name:name,vertices:[]};
					toGeo.morphTargets.push(target);
					
					for(var i=0;i<count;i++){
						var vec=new THREE.Vector3(array[i*3],array[i*3+1],array[i*3+2]);
						target.vertices.push(vec);
					}
					
				});
				
				
			}else{
				console.error("copyIndicesAndWeights:toGeo is not Geometry nor BufferGeometry");
			}
			
			}catch(e){
				console.log(e);
			}
		},
		
		//copy from SkeletonHelper.js
		getChildBoneList:function ( object ) {

			var boneList = [];

			if ( object && object.isBone ) {

				boneList.push( object );

			}

			for ( var i = 0; i < object.children.length; i ++ ) {

				boneList.push.apply( boneList, BoneUtils.getBoneList( object.children[ i ] ) );

			}

			return boneList;

		},
		/*
		 * like FBX format has add _end bones
		 */
		getBoneList:function(skinnedMesh){
			return skinnedMesh.skeleton.bones;
		},
		
		//for Select id is key
		getBoneIdOptions:function ( object ) {

			var boneList = BoneUtils.getBoneList(object);
			var options={};
			boneList.forEach(function(bone){
				options[bone.id]=bone.name;
			});

			return options;

		},
		getBoneNameOptions:function ( mesh ) {

			var boneList = BoneUtils.getBoneList(mesh);
			var options={};
			
			for(var i=0;i<boneList.length;i++){
				var bone=boneList[i];
				options[bone.name]=String(i);

			}

			return options;

		},
		makeQuaternionFromXYZDegree:function(x,y,z,defaultEuler,order){
			return BoneUtils.makeQuaternionFromXYZRadian(THREE.Math.degToRad(x),THREE.Math.degToRad(y),THREE.Math.degToRad(z),defaultEuler,order);
		},
		makeQuaternionFromXYZRadian:function(x,y,z,defaultEuler,order){
			if(x==undefined){
				console.error("makeQuaternionFromXYZDegree:x is undefined");
				return;
			}
			if(y==undefined){
				console.error("makeQuaternionFromXYZDegree:y is undefined");
				return;
			}
			if(z==undefined){
				console.error("makeQuaternionFromXYZDegree:z is undefined");
				return;
			}
			defaultEuler=defaultEuler!==undefined?defaultEuler:new THREE.Euler();
			order=order!==undefined?order:"XYZ";
			
			var q=new  THREE.Quaternion();
			
			var euler=new THREE.Euler(x+defaultEuler.x,y+defaultEuler.y,z+defaultEuler.z,order);
			
			q.setFromEuler(euler);
			
			return q;
		},
		//use BoneUtils.getBoneList(mesh)
		storeDefaultBoneMatrix:function(boneList){
			var defaultBoneMatrix={
					
			};
			var translate=new THREE.Vector3();
			var scale=new THREE.Vector3();
			var euler=new THREE.Euler();
			boneList.forEach(function(bone){
				var m=bone.matrix;
				var name=bone.name;
				var obj={};
				defaultBoneMatrix[name]=obj;
				
				translate.setFromMatrixPosition(m);
				obj.translate=translate.clone();
				scale.setFromMatrixScale(m);
				obj.scale=scale.clone();
				
				euler.setFromRotationMatrix(m);
				
				obj.rotation=euler.clone();
				});
			
		defaultBoneMatrix.print=function(){
			Object.keys(defaultBoneMatrix).forEach(function(key){
				var rotation=defaultBoneMatrix[key].rotation;
				if(rotation!=undefined){
					var x=THREE.Math.radToDeg(rotation.x).toFixed(2);
					var y=THREE.Math.radToDeg(rotation.y).toFixed(2);
					var z=THREE.Math.radToDeg(rotation.z).toFixed(2);
					
					console.log(key,x,y,z);
				}
				
			});
		}
		return defaultBoneMatrix;
		},
		makeEmptyBoneMatrix:function(boneList){
			var defaultBoneMatrix={
					
			};
			var translate=new THREE.Vector3();
			var scale=new THREE.Vector3(1,1,1);
			var euler=new THREE.Euler();
			boneList.forEach(function(bone){
				var name=bone.name;
				var obj={};
				defaultBoneMatrix[name]=obj;
				obj.translate=translate.clone();
				obj.scale=scale.clone();
				obj.rotation=euler.clone();
				});
		return defaultBoneMatrix;
		},
		findBoneIndexByEndsName:function(boneList,name){
			
			var index=-1;
			for(var i=0;i<boneList.length;i++){			
				if(boneList[i].name.endsWith(name)){
					return i;
				}
			}

			return index;
		},
		findBoneByEndsName:function(boneList,name){
			
			for(var i=0;i<boneList.length;i++){			
				if(boneList[i].name.endsWith(name)){
					return boneList[i];
				}
			}

			return null;
		},
		/*
		 * not test scale yet.
		 */
		convertToZeroRotatedBoneMesh:function(mesh){
			mesh.updateMatrixWorld(true);
			var originBoneList=BoneUtils.getBoneList(mesh);
			
			
			
			
			var bonePosition=[];
			originBoneList.forEach(function(bone){
				var pos=new THREE.Vector3().setFromMatrixPosition( bone.matrixWorld );
				bonePosition.push(pos);
			});
			var rawbones=[];
			for(var i=0;i<originBoneList.length;i++){
				var bone=originBoneList[i];
				var parent=originBoneList.indexOf(bone.parent);
				var parentPos=parent==-1?new THREE.Vector3():bonePosition[parent].clone();
				var newPos=bonePosition[i].clone().sub(parentPos);
				var rawbone=BoneUtils.createBone();
				rawbone.pos=newPos.toArray();
				rawbone.parent=parent;
				rawbone.name=bone.name;
				rawbones.push(rawbone);
			}
			console.log(mesh);
			var geo=new THREE.Geometry().fromBufferGeometry(mesh.geometry);
			BoneUtils.copyIndicesAndWeights(mesh.geometry,geo);
			BoneUtils.copyMorphTargets(mesh.geometry,geo);
			
			//var geo=THREE.BufferGeometry().copy(mesh.geometry);
			
			geo.bones=rawbones;
			var skinnedMesh= new THREE.SkinnedMesh(geo);
			return skinnedMesh;
		},
		resetBone:function(mesh,boneSelectedIndex){
			var boneList=BoneUtils.getBoneList(mesh);
			var bone=boneList[boneSelectedIndex];
			bone.matrixWorld.getInverse( mesh.skeleton.boneInverses[ boneSelectedIndex ] );
			if ( bone.parent && bone.parent.isBone ) {
				var parentIndex=boneList.indexOf(bone.parent);
				var parentMatrix=mesh.skeleton.boneInverses[ parentIndex ];
				
				bone.matrix.copy(parentMatrix);
				bone.matrix.multiply( bone.matrixWorld );

			} else {
				bone.matrix.copy( bone.matrixWorld );

			}
			bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );
			bone.updateMatrixWorld(true);
		},
		getOpositeLRName:function(name){
			//TODO support more
			if(name.endsWith("_L")){
				return name.substring(0,name.length-2)+"_R";
			}
			if(name.endsWith("_R")){
				return name.substring(0,name.length-2)+"_L";
			}
			return null;
		},
		flipHorizontalRotation:function(rotation,target){
			if(!rotation.isEuler){
				console.error("flipHorizontalRotation rotation must be Euler");
			}
			target=target==undefined?new THREE.Euler():target;
			target.set(rotation.x,rotation.y*-1,rotation.z*-1,rotation.order);
			return target;
		},swapHorizontalBone:function(bone1,bone2){
			if(!bone1.isBone || !bone2.isBone){
				console.error("swapHorizontalBone bone must be Bone");
			}
			var rot1=BoneUtils.flipHorizontalRotation(bone1.rotation);
			var rot2=BoneUtils.flipHorizontalRotation(bone2.rotation);
			
			bone1.rotation.copy(rot2);
			bone2.rotation.copy(rot1);
		}

};