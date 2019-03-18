Sidebar.TextBoard=function(ap){
	var titlePanel=new UI.TitlePanel("Text Board");
	var width=80;
	var height=25;
	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( width, height ), new THREE.MeshBasicMaterial( { side:THREE.DoubleSide,color: 0xaaaaaa } ) );
	mesh.rotation.y = - Math.PI;
	mesh.rotation.x = - Math.PI;
	ap.scene.add(mesh);
	
	this.visible=false;
	mesh.material.visible=this.visible;
	
	var checkbox=new UI.CheckboxRow("Visible",this.visible,function(v){
		mesh.material.visible=v;
	});
	titlePanel.add(checkbox);
	
	
	function updateCanvas(text){
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#000000';
		ctx.font = "Bold 96px 'Times New Roman'";
		ctx.fillRect(0,0,width*10,height*10);
		ctx.fillStyle = '#000000';
		ctx.fillText(text,100,150);
		mesh.material.map.needsUpdate = true;
	}
	
	var text=new UI.InputRow("Text","",function(v){
		updateCanvas(v);
	});
	titlePanel.add(text);
	var canvas = document.createElement('canvas');
	canvas.width=width*10;
	canvas.height=height*10;
	var ctx=canvas.getContext('2d');
	var texture=new THREE.CanvasTexture( canvas );
	texture.flipY=true;
	texture.needsUpdate=true;
	mesh.material.map = texture;
	updateCanvas("hello");
	var x=-0;
	var y=190;
	var z=0;
	mesh.position.set(x,y,z);
	
	var xcontrol=new UI.NumberButtons("X",-1000,1000,100,x,function(v){
		mesh.position.x=v;
	},[0]);
	titlePanel.add(xcontrol);
	
	var ycontrol=new UI.NumberButtons("Y",-1000,1000,100,y,function(v){
		mesh.position.y=v;
	},[0]);
	titlePanel.add(ycontrol);
	
	var zcontrol=new UI.NumberButtons("Z",-1000,1000,100,z,function(v){
		mesh.position.z=v;
	},[0]);
	titlePanel.add(zcontrol);
	
	return titlePanel;
}