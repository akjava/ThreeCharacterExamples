Sidebar.TwistAutoupdate=function(ap){
	var scope=this;
	var container=new UI.TitlePanel("Twist Autoupdate");
	var enabled=new UI.SwitchRow("Enabled","Disabled",ap.twistAutoUpdate,function(v){
		ap.twistAutoUpdate=v;
	});
	container.add(enabled);
	return container;
}