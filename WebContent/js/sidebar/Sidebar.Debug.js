Sidebar.Debug=function(ap){
	var container=new UI.TitlePanel("Debug");
	var btRow=new UI.ButtonRow("Print App",function(){
		console.log(ap);
	});
	container.add(btRow);
	var btRow=new UI.ButtonRow("Print Mesh",function(){
		console.log(ap.skinnedMesh);
	});
	container.add(btRow);
	var btRow=new UI.ButtonRow("Print ap.objects",function(){
		var len=ap.objects.length;
		console.log("ap.objects",len,ap.objects);
	});
	container.add(btRow);
	
	var ikcheck=new UI.Subtitle("Ik");
	container.add(ikcheck);
	var ikrow=new UI.Row();
	container.add(ikrow);
	
	var iklogging=new UI.CheckboxText("logging",false,function(v){
		ap.ikControler.logging=v;
	})
	container.add(iklogging);
	var ikDebug=new UI.CheckboxText("debug",false,function(v){
		ap.ikControler.debug=v;
	})
	container.add(ikDebug);
	return container;
}