Sidebar.TimelinerControl=function(ap){
	var container=new UI.TitlePanel("Timeliner Control");
	
	//
	var scroll=new UI.IntegerPlusMinus("Scroll",0,60*60,10,0,function(v){
		ap.timeliner.context.dispatcher.fire('scrollTime.update',v);
	},[5,10,30]);
	container.add(scroll);
	scroll.text.setWidth("40px");
	scroll.number.setWidth("24px");
	
	
	var scaleValues=[15,30,60,120,240];
	var listRow=new UI.ListRow("Scale",scaleValues,function(v){
		ap.timeliner.context.dispatcher.fire('update.scale',v);
	},60)
	listRow.text.setWidth("40px");
	container.add(listRow);
	
	
	
	var total=new UI.IntegerPlusMinus("Total",0,60*60,10,3,function(v){
		ap.timeliner.context.dispatcher.fire('totalTime.update',v);
	},[1,5],3);
	container.add(total);
	total.text.setWidth("40px");
	total.number.setWidth("30px");
	
	
	ap.getSignal("timelinerSeeked").add(function(t){
		var duration=ap.timeliner.context.totalTime;//only this one is way to get update;
		total.setValue(duration);
	});
	
	return container;
}