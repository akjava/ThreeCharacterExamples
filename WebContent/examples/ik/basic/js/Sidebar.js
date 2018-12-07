var Sidebar = function ( application ) {
	var ap=application
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Basic IK"));
	
	//ui
	
	
	
	var p1=new UI.Panel();
	container.add(p1);
	var row=new UI.Row();
	p1.add(row);
	
	var bt=new UI.Button("Create Joints and Goal").onClick( function () {

		ap.signals.ikCreated.dispatch();
		

	} );
	row.add(bt);
	
	var randomSize=new UI.IntegerButtons("Space Size",5,25,1,ap.randomSize,function(v){
		ap.randomSize=v;
	},[5,10,15]);
	p1.add(randomSize);
	var minDistance=new UI.IntegerButtons("Min Distance",1,10,1,ap.minDistance,function(v){
		ap.minDistance=v;
	},[1,3,5]);
	p1.add(minDistance);
	var maxDistance=new UI.IntegerButtons("Max Distance",1,15,1,ap.maxDistance,function(v){
		ap.maxDistance=v;
	},[5,10,15]);
	p1.add(maxDistance);
	var jointCount=new UI.IntegerButtons("Joint Count",2,30,1,ap.jointCount,function(v){
		ap.jointCount=v;
	},[5,10,20]);
	p1.add(jointCount);
	var maxAngle=new UI.NumberButtons("Max Angle",0.1,45,1,ap.maxAngle,function(v){
		ap.maxAngle=v;
	},[0.1,1,5]);
	p1.add(maxAngle);
	var iteration=new UI.IntegerButtons("Iteration",1,100,1,ap.iteration,function(v){
		ap.iteration=v;
	},[5,10,50]);
	p1.add(iteration);
	
	
	
	var bt=new UI.Button("Solve Ik").onClick( function () {
		var lastMesh=ap.joints[ap.joints.length-1];
		var targetMesh=ap.target;
		
		var targetPos=targetMesh.getWorldPosition(new THREE.Vector3());
		
		for(var j=0;j<ap.iteration;j++){
		
		
		
		
		for(var i=0;i<ap.joints.length-1;i++){
			var lastJointPos=lastMesh.getWorldPosition(new THREE.Vector3());
			
			var joint=ap.joints[i];
			var jointPos=joint.getWorldPosition(new THREE.Vector3());
			var jointRotQ=joint.quaternion;
			
			var newQ=IkUtils.stepCalculate(lastJointPos,jointPos,jointRotQ,targetPos,ap.maxAngle);
			joint.quaternion.copy(newQ);
		}
		}

	} );
	row.add(bt);
	
	
	return container;
}
