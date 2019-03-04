Sidebar.Grid=function(ap){
	var scope=this;
	this.margin=0;
	var titlePanel=new UI.TitlePanel("Grid");
	var visibleRow=new UI.CheckboxRow("Visible",true,function(v){
		grid.material.visible=v;
	});
	visibleRow.text.setWidth("40px");
	visibleRow.checkbox.setWidth("20px");
	titlePanel.add(visibleRow);
	


	var grid = new THREE.GridHelper( 2000,240);
	grid.material.opacity = 1.0;
	grid.material.transparent = true;
	ap.scene.add( grid );
	ap.groundGrid=grid;
	
	var opacity=new UI.NumberButtonsSpan("Opacity",0,1,1,1,function(v){
		grid.material.opacity=v;
	},[0.25,0.5,1]);
	visibleRow.add(opacity);
	opacity.text.setWidth("50px");
	opacity.number.setWidth("40px");
	//TODO allow change
	
	
	return titlePanel;
}