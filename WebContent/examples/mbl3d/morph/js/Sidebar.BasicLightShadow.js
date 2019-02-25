Sidebar.BasicLightShadow = function ( application ) {
	var scope=this;
	var container=new UI.Panel();
	container.setId( 'light' );
	
	var lightDiv=new UI.Div().setClass("title").add(new UI.Text("Shadow"));
	container.add(lightDiv);
	
	var shadowBias=new UI.NumberButtons("Bias",0,0.1,0.01,0,function(v){
		scope.directionalLight.shadow.bias=v;
		},
			[0,0.001]);
	container.add(shadowBias);
	
	var shadowRadius=new UI.NumberButtons("Radius",.1,10,0.1,1,function(v){
		scope.directionalLight.shadow.radius=v;
		},
			[.1,1,2]);
	container.add(shadowRadius);
	
	var shadowCameraSize=new UI.NumberButtons("Camera Size",0,300,10,150,function(val){
		scope.directionalLight.shadow.camera.top = val;
		scope.directionalLight.shadow.camera.bottom = -val;
		scope.directionalLight.shadow.camera.left = -val;
		scope.directionalLight.shadow.camera.right = val;
		scope.directionalLight.shadow.camera.updateProjectionMatrix();
		},
			[50,150,300]);
	container.add(shadowCameraSize);
	
	var shadowNear=new UI.NumberButtons("Near",0,100,1,0.5,function(v){
		scope.directionalLight.shadow.camera.near=v;
		scope.directionalLight.shadow.camera.updateProjectionMatrix();
		},
			[.5,5,50]);
	container.add(shadowNear);
	
	var shadowFar=new UI.NumberButtons("Far",0,5000,100,2000,function(v){
		scope.directionalLight.shadow.camera.far=v;
		scope.directionalLight.shadow.camera.updateProjectionMatrix();
		},
			[50,500,2000]);
	container.add(shadowFar);
	
	var selectRow=new UI.ListRow("Map Size",[128,256,512,1024,2048,4096],function(v){
		scope.directionalLight.shadow.mapSize.width=v;
		scope.directionalLight.shadow.mapSize.height=v;
	},512);
	
	container.add(selectRow);
	
	
	var lightDiv=new UI.Div().setClass("title").add(new UI.Text("Light"));
	container.add(lightDiv);
	
	var row1=new UI.Row();
	
	var useLightText=new UI.Text("Background Light").setWidth( '120px' );
	row1.add(useLightText);
	
	var options={Ambient:'Ambient',Hemisphere:'Hemisphere'};
	var lightTypeSelect=new UI.Select();
	lightTypeSelect.setOptions(options);
	lightTypeSelect.setValue('Ambient');
	
	lightTypeSelect.onChange(function (){
		var value=lightTypeSelect.getValue();
		switch ( value ) {
			case 'Ambient':
				scope.ambientLight.intensity=1;
				scope.hemisphereLight.intensity=0;
				break;
			case 'Hemisphere':
				scope.ambientLight.intensity=0;
				scope.hemisphereLight.intensity=1;
				break;
		}
	});
	
	row1.add(lightTypeSelect);
	
	container.add(row1);
	this.directionalLightVisible=false;
	
	var visibleRow=new UI.CheckboxRow("Directional Visible",this.directionalLightVisible,function(v){
		scope.directionalLightVisible=v;
		scope.directionalLightHelper.visible=v;
	});
	container.add(visibleRow);
	
	var receiveShadowCheck=new UI.CheckboxRow("Character receive shadow",application.characterRecieveShadow,function(v){
		application.characterRecieveShadow=v;
		application.skinnedMesh.receiveShadow=v;
		application.skinnedMesh.material.needsUpdate=true;
	});
	container.add(receiveShadowCheck);
	

	
	
	
	this.ambientColor=0xaaaaaa;
	this.ambientLight = new THREE.AmbientLight(this.ambientColor);
	application.scene.add( this.ambientLight );
	
	var ambientRow=new UI.ColorRow("Color",this.ambientColor,function(value){
		scope.ambientColor=value;
		scope.ambientLight.color.set(scope.ambientColor);
	});
	container.add(ambientRow);
	
	
	
	
	this.hemisphereGroundColor=0x888888;
	this.hemisphereSkyColor=0xdddddd;

	this.hemisphereLight = new THREE.HemisphereLight(this.hemisphereSkyColor,this.hemisphereGroundColor);
	application.scene.add( this. hemisphereLight );
	this.hemisphereLight.intensity=0;//control visible
	
	var hemisphereSkyRow=new UI.ColorRow("Sky Color",this.hemisphereSkyColor,function(v){
		scope.hemisphereSkyColor=v;
		scope.hemisphereLight.color.set(scope.hemisphereSkyColor);
	});
	
	var hemisphereGroundRow=new UI.ColorRow("Ground Color",this.hemisphereGroundColor,function(v){
		scope.hemisphereGroundColor=v;
		scope.hemisphereLight.groundColor.set(scope.hemisphereGroundColor);
	});
	
	
	
	
	
	
	this.directionalColor=0x444444;

	this.directionalLight = new THREE.DirectionalLight(this.directionalColor);
	this.directionalLight.position.set( 150, 150, 200 );
	this.directionalLight.castShadow = true;
	this.directionalLight.shadow.camera.top = 180;
	this.directionalLight.shadow.camera.bottom = -100;
	this.directionalLight.shadow.camera.left = -120;
	this.directionalLight.shadow.camera.right = 120;
	this.directionalLight.shadow.camera.far = 2000;
	application.scene.add(  this.directionalLight );
	
	this.directionalLight.target.position.set(0,0,0);
	this.directionalLight.target.updateMatrixWorld();
	
	this.directionalLightHelper = new THREE.DirectionalLightHelper( this.directionalLight, 5 ,0xaaaaaa);
	this.directionalLightHelper.visible=this.directionalLightVisible;
	application.scene.add(this.directionalLightHelper);
	
	
	var directionalRow=new UI.ColorRow("Color",this.directionalColor,function(v){
		scope.directionalColor=v;
		scope.directionalLight.color.set(scope.directionalColor);
	});
	
	var directionalPosX=new UI.NumberButtons("Pos X",-200,200,10,this.directionalLight.position.x,function(v){
		scope.directionalLight.position.setX(v);
		scope.directionalLight.updateMatrixWorld();
		scope.directionalLightHelper.update();},
			[50,100,150]);
	var directionalPosY=new UI.NumberButtons("Pos Y",-0,600,50,this.directionalLight.position.y,function(v){
		scope.directionalLight.position.setY(v);
		scope.directionalLight.updateMatrixWorld();
		scope.directionalLightHelper.update();},
			[50,100,150]);
	var directionalPosZ=new UI.NumberButtons("Pos Z",-200,200,10,this.directionalLight.position.z,function(v){
		scope.directionalLight.position.setZ(v);
		scope.directionalLight.updateMatrixWorld();
		scope.directionalLightHelper.update();},
			[50,100,200]);
	var directionalTargetX=new UI.NumberButtons("Target X",-200,200,10,this.directionalLight.target.position.x,function(v){
		scope.directionalLight.target.position.setX(v);
		scope.directionalLight.target.updateMatrixWorld();
		scope.directionalLightHelper.update();},
			[0,100,200]);
	var directionalTargetY=new UI.NumberButtons("Target Y",0,600,50,this.directionalLight.target.position.y,function(v){
		scope.directionalLight.target.position.setY(v);
		scope.directionalLight.target.updateMatrixWorld();
		scope.directionalLightHelper.update();},
			[0,100,150]);
	var directionalTargetZ=new UI.NumberButtons("Target Z",-200,200,10,this.directionalLight.target.position.z,function(v){
		scope.directionalLight.target.position.setZ(v);
		scope.directionalLight.target.updateMatrixWorld();
		scope.directionalLightHelper.update();},
			[0,100,200]);
	
	
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

var directionalTab = new UI.Text( 'Directional' ).onClick( onClick );
tabs.add( directionalTab);
var directional= new UI.Span().add(
		directionalRow,directionalPosX,directionalPosY,directionalPosZ,directionalTargetX,directionalTargetY,directionalTargetZ
	);
container.add( directional);var ambientTab = new UI.Text( 'Ambient' ).onClick( onClick );
tabs.add( ambientTab);
var ambient= new UI.Span().add(
		ambientRow
	);
container.add( ambient);var hemisphereTab = new UI.Text( 'Hemisphere' ).onClick( onClick );
tabs.add( hemisphereTab);
var hemisphere= new UI.Span().add(
		hemisphereSkyRow,hemisphereGroundRow
	);
container.add( hemisphere);


function select( section ) {
	//move here
	directionalTab.setClass( '' );
	directional.setDisplay( 'none' );
	ambientTab.setClass( '' );
	ambient.setDisplay( 'none' );
	hemisphereTab.setClass( '' );
	hemisphere.setDisplay( 'none' );
	switch ( section ) {

	

	case 'Directional':
					directionalTab.setClass( 'selected' );
					directional.setDisplay( '' );
					break;
	

	case 'Ambient':
					ambientTab.setClass( 'selected' );
					ambient.setDisplay( '' );
					break;
	

	case 'Hemisphere':
					hemisphereTab.setClass( 'selected' );
					hemisphere.setDisplay( '' );
					break;
	}

	}
	select('Ambient');

	return container;
}




