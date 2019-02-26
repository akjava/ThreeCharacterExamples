var IkRotateRow=function(ap){
	var scope=this;
	var row=new UI.Row();
	var axisList=new UI.List(["x","y","z"]);
	row.add(axisList);
	var minMaxList=new UI.List(["Min","Center","Max"]);
	row.add(minMaxList);
	
	ap.getSignal("ikSelectionChanged").add(function(selection){
		if(selection==null){
			bt.setDisabled(true);
		}else{
			bt.setDisabled(false);
		}
	});
	
	var bt=new UI.Button("Rotate").onClick(function(){
		var axis=axisList.getValue();
		var target=minMaxList.getValue();
		var name=ap.ikControler.getSelectedIkName();
		if(name==null){
			return;
		}
		var indices=ap.ikControler.getEffectedBoneIndices(name);
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		indices.forEach(function(index){
			var bone=boneList[index];
			var name=bone.name;
			var obj=null;
			switch(target){
			case "Min":
				obj=ap.ikControler.ikLimitMin[name];
				break;
			case "Max":
				obj=ap.ikControler.ikLimitMax[name];
				break;
			case "Center":
				var mi=ap.ikControler.ikLimitMin[name];
				var mx=ap.ikControler.ikLimitMax[name];
				obj={x:(mx.x+mi.x)/2,y:(mx.y+mi.y)/2,z:(mx.z+mi.z)/2};
				break;
			}
			
			var nr={x:0,y:0,z:0};
			nr[axis]=obj[axis];
			nr=AppUtils.degToRad(nr);
			//console.log(nr);
			bone.rotation.set(nr.x,nr.y,nr.z);
			ap.getSignal("boneRotationChanged").dispatch(index);
			ap.getSignal("boneRotationFinished").dispatch(index);
		});
	});
	bt.setDisabled(true);
	row.add(bt);
	return row;
}