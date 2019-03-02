var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Ik Bone Order"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	
	main.add(new Sidebar.IkControl(ap));
	main.add(new IkRotateRow(ap));
	main.add(new IkOrderChangeRow(ap));
	
	main.add(new Sidebar.IkBasic(ap));
	main.add(new IkSolveRow(ap));
	main.add(new Sidebar.IkReset(ap));
	
	main.add(new Sidebar.IkBoneList(ap));
	var boneRotate=new Sidebar.BoneRotate(ap,false,true);
	boneRotate.add(new LRBoneRow(ap));
	
	
	main.add(boneRotate);
	
	
	
	
	main.add(new Sidebar.IkPresetIO(ap));
	
	

	
	

	
	main.add(new Sidebar.IkPreset(ap));
	
	ap.ikControler.logging=true;
	

	Logics.transformSelectionChangedForIkPresets(ap);
	

	
	
	
	
	var sub2=tab.addItem("Sub");
	
	sub2.add(new Sidebar.MeshRotate(ap));
	sub2.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	
	
	sub2.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);

	sub2.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub2.add(new Sidebar.SimpleLight(ap));
	
	
	var mesh=null;
	var test=new UI.ButtonRow("test show order guide",function(){
		var target=ap.boneSelectedIndex;
		var bone=BoneUtils.getBoneList(ap.skinnedMesh)[target];
		var step=15;
		var points=[];
		
		var beforeRot=bone.parent.rotation.clone();
		
		console.log(bone.parent);
		var limitMin=ap.ikControler.ikLimitMin;
		var limitMax=ap.ikControler.ikLimitMax;
		console.log(limitMin,limitMax);
		
		if(mesh!=null){
			mesh.parent.remove(mesh);
		}
		mesh=new THREE.Group();
		ap.scene.add(mesh);
		
		var name=bone.parent.name;
		var orders=["XZY","YZX","ZYX"];
		var colors=[0x000088,0x880000,0x008800];
		for(var k=0;k<orders.length;k++){
		bone.parent.rotation.order=orders[k];
		for(var j=-180;j<180;j+=step){
		for(var i=-180;i<180;i+=step){
			var z=i;
			var y=j;
			if(limitMin[name].z>z || limitMax[name].z<z)
				continue;
			if(limitMin[name].y>y || limitMax[name].y<y)
				continue;
			
			
			bone.parent.rotation.z=THREE.Math.degToRad(i);
			bone.parent.rotation.y=THREE.Math.degToRad(j);
			
			ap.boneAttachControler.update(true);
			//console.log(y,z,limitMin[name].z,limitMin[name].y,limitMin[name].y,limitMin[name].z);
			var pt=ap.boneAttachControler.clonePositionAt(target);
			
			var color=colors[k];
			var box=new THREE.BoxGeometry(2,2,2);
			var boxMesh=new THREE.Mesh(box,new THREE.MeshBasicMaterial({color:color}));
			boxMesh.position.copy(pt);
			mesh.add(boxMesh);
		}
		}
		}
		
		
		
		
		
		
		bone.parent.rotation.copy(beforeRot);
	})
	sub2.add(test);
	
	var debug=tab.addItem("Debug");
	debug.add(new Sidebar.Debug(ap));
	
	return container;
}
