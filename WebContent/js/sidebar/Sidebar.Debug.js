Sidebar.Debug=function(ap){
	var container=new UI.TitlePanel("Debug");
	var btRow=new UI.ButtonRow("Print App",function(){
		console.log(ap);
	});
	container.add(btRow);
	var btRow=new UI.ButtonRow("Print ap.objects",function(){
		var len=ap.objects.length;
		console.log("ap.objects",len,ap.objects);
	});
	container.add(btRow);
	return container;
}