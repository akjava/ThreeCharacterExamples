Sidebar.MaterialType = function ( application ) {
	var ap=application;
	var container=new UI.Panel();
	container.setId( 'material' );
	
	ap.materialType='MeshToonMaterial';
	ap.materialWireframe=false;
	
	var materialDiv=new UI.Div().setClass("title").add(new UI.Text("Material"));
	container.add(materialDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var row1text=new UI.Text("Wireframe").setWidth( '90px' );
	row1.add(row1text);
	
	var wireframeCheck=new UI.Checkbox();
	wireframeCheck.setValue(application.materialWireframe);

	wireframeCheck.onChange(function(){
		application.materialWireframe=wireframeCheck.getValue();
		application.signals.materialChanged.dispatch();
	});
	row1.add(wireframeCheck);
	
	var row2=new UI.Row();
	container.add(row2);
	
	var row2text=new UI.Text("Type").setWidth( '90px' );
	row2.add(row2text);
	var materialOptions={'MeshPhongMaterial':'MeshPhongMaterial','MeshToonMaterial':'MeshToonMaterial'}
	var materialSelect=new UI.Select().setWidth( '160px' );
	row2.add(materialSelect);
	materialSelect.onChange(function(){
		application.materialType=materialSelect.getValue();
		application.signals.materialChanged.dispatch();
	});
	materialSelect.setOptions(materialOptions);
	materialSelect.setValue(application.materialType);
	
	
	
	return container;
}