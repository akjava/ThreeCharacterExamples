Example=function(application){
	var ap=application;
	
	ap.camera.position.set( 0, 0, 30 );
	ap.controls.target.set(0,0,0);
	ap.controls.update();
	
	var group=new THREE.Group();
	
	ap.scene.add(group);
	
	
	function rand(){
		return Math.random()*ap.randomSize-ap.randomSize/2;
	}
	

	function lineTo(mesh1,mesh2){
		var geo = new THREE.Geometry();
		geo.vertices.push( new THREE.Vector3(  ));
		geo.vertices.push( mesh2.position.clone());
		var material=new THREE.LineBasicMaterial({color:0xcccccc});
		
		var joint = new THREE.Line( geo,material);
		mesh1.add(joint);
	}
	
	var parentPos=null;
	var parent=group;
	ap.signals.ikCreated.add(function(){
		ap.joints=[];
		//clear first,only one?
		if(group.children.length>0){
			AppUtils.clearAllChildren(group);
			parentPos=null;
			parent=group;
		}
		
		//make joint
		for( var i=0;i<ap.jointCount;i++){
			var x=rand();
			var y=rand();
			var z=rand();
			
			
			var pos=new THREE.Vector3(x,y,z);
			//AppUtils.printVec(pos);
			if(parentPos!=null){
				var distance=pos.distanceTo(parentPos);
				//console.log("before distance",distance);
				if(distance>ap.maxDistance || distance<ap.minDistance){
					var r=ap.maxDistance/distance;
					var sub=pos.sub(parentPos);
					sub.multiplyScalar(r);
					sub.add(parentPos);
					pos.copy(sub);
					//console.log("after distance",pos.distanceTo(parentPos));
				}
			}
			
			var mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x880000}));
			
			
			if(parentPos!=null){
				var sub=pos.clone().sub(parentPos);
				mesh.position.copy(sub);
				lineTo(parent,mesh);
			}else{
				mesh.position.copy(pos);
			}
			
			parent.add(mesh);
			ap.joints.push(mesh);
			parent=mesh;
			parentPos=parent.getWorldPosition(new THREE.Vector3());
		}
		parent.material.color.set(0x000088);
		
		//make goal,TODO random
		var target=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({color:0x008800,transparent:true,opacity:0.5}));
		target.position.set(0,0,0);
		group.add(target);
		ap.target=target;
	});
	
	
	ap.signals.ikCreated.dispatch();
	
	
}