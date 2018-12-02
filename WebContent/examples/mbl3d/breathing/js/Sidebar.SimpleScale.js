Sidebar.SimpleScale=function(ap){
var container = new UI.Panel();
container.add(new UI.SubtitleRow("SCALE"));

var scaleButtons=new UI.NumberButtons("Scale",0.1,5,1,ap.scale,function(v){
	ap.scale=v;
},[1,1.01,1.1]);
container.add(scaleButtons);

var scaleDuration=new UI.NumberButtons("Duration",0.01,100,1,ap.scaleDuration,function(v){
	ap.scaleDuration=v;
},[0.1,0.5,1]);
container.add(scaleDuration);

return container;
}
	