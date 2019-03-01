var IkOrderChangeRow=function(ap){
	var row=new UI.Row();
	var logging=true;
	var selectedIkName=null;
	ap.getSignal("ikSelectionChanged").add(function(name){
		selectedIkName=name;
		if(name==null){
			bt.setDisabled(true);
		}else{
			bt.setDisabled(false);
		}
	});
	
	var needRecover={};
	
	
	
	var orderList=new UI.List(BoneUtils.orders);
	row.add(orderList);
	var euler=new THREE.Euler();
	var bt=new UI.Button("Change Euler-Order").onClick(function(){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		var indices=ap.ikControler.getEffectedBoneIndices(selectedIkName);
		
		var order=orderList.getValue();
		euler.order=order;
		indices.forEach(function(index){
			var bone=boneList[index];
			
			if(needRecover[String(index)]==undefined){
				needRecover[String(index)]=bone.rotation.order;	
			}
		
			bone.rotation.order=order;//for smooth continue ik
			if(logging){
				console.log("change order ",bone.name,order);
			}
		});
	});
	row.add(bt);
	bt.setDisabled(true);
	
	ap.getSignal("transformSelectionChanged").add(function(target){
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		Object.keys(needRecover).forEach(function(index){
			var order=needRecover[index];
			var bone=boneList[Number(index)];
			euler.order=order;
			euler.setFromQuaternion(bone.quaternion);
			bone.rotation.copy(euler);
			ap.getSignal("boneRotationChanged").dispatch(index);
			if(logging){
				console.log("recover order ",bone.name,order);
			}
		});
		needRecover={};
	});
	
	return row;
}