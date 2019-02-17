Sidebar.OutlineEffect = function ( ap ) {
	var ap=application;
	var container=new UI.TitlePanel("Outliner");
	
	ap.drawOutline=false;
	var outlineCheckRow=new UI.CheckboxRow("Draw Outline",ap.drawOutline,function(v){
		ap.drawOutline=v;
	})
	container.add(outlineCheckRow);
	
	function update(){
		var color=new THREE.Color(ap.outlinerColor).toArray();
		
		param={defaultColor:color,defaultThickness:ap.outlinerThickness};
		ap.outlineEffect=new THREE.OutlineEffect(ap.renderer,param);
		
	}
	
	if(ap.outlinerColor==undefined)
	ap.outlinerColor=0;
	var outlinerColor=new UI.ColorRow("color",ap.outlinerColor,function(v){
		ap.outlinerColor=v;
		update();
	});

	container.add(outlinerColor);
	
	if(ap.outlinerThickness==undefined)
	ap.outlinerThickness=0.0005;
	var outlinerThickness=new UI.NumberButtons("Thickness",0.0001,0.1,.001,ap.outlinerThickness,function(v){
		ap.outlinerThickness=v;
		update();
	},[0.0005,0.001]);
	outlinerThickness.number.precision=4;
	container.add(outlinerThickness);
	
	update();
	
	ap.onRender=function(){
		if(ap.drawOutline){
			ap.outlineEffect.render( ap.scene, ap.camera );
		}else{
			ap.renderer.render( ap.scene, ap.camera );
		}
		ap.signals.rendered.dispatch();
	}
	
	return container;
}