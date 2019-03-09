var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Load Example"));
	
	var titlePanel=new UI.TitlePanel("Credits");
	container.add(titlePanel);
	var row=new UI.Row();
	titlePanel.add(row);
	var anchor=new UI.Anchor("https://3d.nicovideo.jp/works/td32797","Dwango");
	var license=new UI.Anchor("http://3d.nicovideo.jp/alicia/rule.html","License");
	row.add(new UI.Text("Alicia by ").setMarginRight("6px"),anchor,license.setMarginLeft("6px"));
	
	var skeletonPanel=new UI.TitlePanel("Skeleton");
	container.add(skeletonPanel);
	var checkRow=new UI.CheckboxRow("Visible",false,function(v){
		ap.skeletonHelper.material.visible=v;
	});
	skeletonPanel.add(checkRow);
	
	return container;
}
