Sidebar.Hair = function ( application ) {
	var scope=this;
	var container=new UI.Panel();
	container.setId( 'hair' );
	
	var hairDiv=new UI.Div().setClass("title").add(new UI.Text("Hair"));
	container.add(hairDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	this.hairBase="../../../dataset/mbl3d/hairs/";
	this.hairSelection='geometry-twelve-short';
	this.hairColor=0x694b17;
	this.hairX=100;
	this.hairY=100;
	this.hairZ=100;

	this.hairMaterial=null;
	//list
	var hairNameList=[
		 '',
		 'geometry-twelve-short'/*,
		 'geometry-twelve-bob-divided',
		 'geometry-twelve-bob',
		 'geometry-twelve-extra_long',
		 'geometry-twelve-long',
		 'geometry-twelve-medium',
		 'geometry-twelve-semi_long',
		 'geometry-twelve-short_bob',
		 'geometry-twelve-short_bob2',
		 'geometry-twelve-short_bob3',
		 'geometry-twelve-super_long',
		 'geometry-twelve-very_short',
		 'geometry-twelve01-hair01a',
		 'geometry-twelve01-hair02',
		 'geometry-twelve01-hair03',
		 'geometry-twelve01-hair03b',
		 'geometry-twelve01-hair09',
		 'geometry-twelve01-hair10',
		 'geometry-twelve01-hair11',
		 'geometry-twelve01-hair12',
		 'geometry-soso1-hair1',
		 'geometry-soso1-hair2',
		 'geometry-soso1-hair3',
		 'geometry-soso2-hair1',
		 'geometry-soso2-hair2',
		 'geometry-soso2-hair3',
		 'geometry-soso3-hair03',
		 'geometry-soso3-hair03a',
		 'geometry-soso4-hair03',
		 'geometry-soso4-hair08',
		 'geometry-soso5-hair04',
		 'geometry-soso5-hair05',
		 'geometry-soso5-hair05a',
		 'geometry-soso5-hair05b',
		 'geometry-soso5-hair05c',
		 'geometry-soso5-hair05d',
		 'geometry-soso5-hair05e',
		 'geometry-soso5-hair05f',
		 'geometry-soso5-hair05g',
		 'geometry-soso5-hair05x',
		 'geometry-soso6-hair06',
		 'geometry-soso6-hair06a'*/
	 ];
	
	var options={};
	for(var i=0;i<hairNameList.length;i++){
		var name=hairNameList[i];
		
		options[name]=name;
	}
	var rowList=new UI.Row();
	container.add(rowList);
	var hairList=new UI.Select();
	hairList.setOptions(options);
	hairList.setValue(this.hairSelection);
	rowList.add(hairList);
	hairList.onChange(function(){
		scope.hairSelection=hairList.getValue();
		loadHair();
	});
	
	
	//color
	var rowColor=new UI.Row();
	container.add(rowColor);
	var rowhairtext=new UI.Text("Hair Color").setWidth( '90px' );
	rowColor.add(rowhairtext);
	
	var color=new UI.Color();
	rowColor.add(color);
	
	
	color.setHexValue(this.hairColor);
	
	color.onChange(function(){
		scope.hairColor=color.getValue();
		application.hairMesh.material.color.set(scope.hairColor);
	})
	
	//posX
	var rowX=new UI.Row();
	container.add(rowX);
	var rowxtext=new UI.Text("Scale X").setWidth( '90px' );
	rowX.add(rowxtext);
	
	var posXNumber=new UI.Number().setWidth('60px');
	posXNumber.min=50;
	posXNumber.max=150;
	posXNumber.step=10;
	posXNumber.setValue(this.hairX);
	
	function updateHairX(){
		scope.hairX=posXNumber.getValue();
		application.hairMesh.scale.setX(scope.hairX);
	}
	
	posXNumber.onChange(function(){
		updateHairX();
	});
	rowX.add(posXNumber);
	
	rowX.add(new UI.Button("90").onClick(function(){posXNumber.setValue(90);updateHairX()}));
	rowX.add(new UI.Button("100").onClick(function(){posXNumber.setValue(100);updateHairX()}));
	rowX.add(new UI.Button("125").onClick(function(){posXNumber.setValue(125);updateHairX()}));
	
	//posy
	var rowY=new UI.Row();
	container.add(rowY);
	var rowytext=new UI.Text("Scale Y").setWidth( '90px' );
	rowY.add(rowytext);
	
	var posYNumber=new UI.Number().setWidth('60px');
	posYNumber.min=75;
	posYNumber.max=125;
	posYNumber.step=1;
	posYNumber.setValue(this.hairY);
	
	function updateHairY(){
		scope.hairY=posYNumber.getValue();
		application.hairMesh.scale.setY(scope.hairY);
	}
	
	posYNumber.onChange(function(){
		updateHairY();
	});
	rowY.add(posYNumber);
	
	rowY.add(new UI.Button("95").onClick(function(){posYNumber.setValue(95);updateHairY()}));
	rowY.add(new UI.Button("100").onClick(function(){posYNumber.setValue(100);updateHairY()}));
	rowY.add(new UI.Button("105").onClick(function(){posYNumber.setValue(105);updateHairY()}));
	
	//posZ
	var rowZ=new UI.Row();
	container.add(rowZ);
	var rowztext=new UI.Text("Scale Z").setWidth( '90px' );
	rowZ.add(rowztext);
	
	var posZNumber=new UI.Number().setWidth('60px');
	posZNumber.min=50;
	posZNumber.max=150;
	posZNumber.step=10;
	posZNumber.setValue(this.hairZ);
	
	function updateHairZ(){
		scope.hairZ=posZNumber.getValue();
		application.hairMesh.scale.setZ(scope.hairZ);
	}
	
	posZNumber.onChange(function(){
		updateHairZ();
	});
	rowZ.add(posZNumber);
	
	rowZ.add(new UI.Button("90").onClick(function(){posZNumber.setValue(90);updateHairZ()}));
	rowZ.add(new UI.Button("100").onClick(function(){posZNumber.setValue(100);updateHairZ()}));
	rowZ.add(new UI.Button("125").onClick(function(){posZNumber.setValue(125);updateHairZ()}));
	
	
	function loadHair(){
		if(scope.hairSelection){
		var hairUrl=scope.hairBase+scope.hairSelection+".json";
		
		
		var loader = new THREE.JSONLoader();
		loader.load(
				hairUrl,

				// onLoad callback
				function ( geometry, materials ) {
					if(application.hairMesh!=null){
						application.scene.remove(application.hairMesh);
					}
					
					
					application.hairMesh = new THREE.Mesh( geometry);
					application.hairMesh.castShadow = true;
					application.hairMesh.scale.set(scope.hairX,scope.hairY,scope.hairZ)
					application.scene.add( application.hairMesh );
					//TODO fix position,better to avoid reload.
					
					application.signals.hairMaterialTypeChanged.dispatch();
				}
				
				);
		}else{
			scope.hairMaterial.visible=false;
		}
		
	}
	
	loadHair();
	
	application.signals.hairMaterialTypeChanged.add(function(){
		scope.hairMaterial =  new window['THREE'][application.materialType]({wireframe:application.materialWireframe,color:scope.hairColor,shininess:100,specular:0x444444});
		application.hairMesh.material=scope.hairMaterial;
	});
	
	
	application.signals.materialChanged.add(function(){
		scope.hairMaterial.wireframe=application.materialWireframe;
	})
	
	return container;
}