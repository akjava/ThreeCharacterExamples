Sidebar.RandomScale=function(ap){
var container = new UI.Panel();



var minScale=new UI.NumberButtons("Min Scale",0.1,2,1,ap.minScale,function(v){
	ap.minScale=v;
},[1,1.01,1.1]);
container.add(minScale);

var maxScale=new UI.NumberButtons("Max Scale",0.1,2,1,ap.maxScale,function(v){
	ap.maxScale=v;
},[1,1.01,1.1]);
container.add(maxScale);

var randomScaleCount=new UI.IntegerButtons("Random Count",2,100,10,ap.randomScaleCount,function(v){
	ap.randomScaleCount=v;
},[1,10,50]);
container.add(randomScaleCount);
var randomScaleContinue=new UI.IntegerButtons("Random Continue",2,100,10,ap.randomScaleContinue,function(v){
	ap.randomScaleContinue=v;
},[1,4,8]);
container.add(randomScaleContinue);

var randomScaleDuration=new UI.NumberButtons("Duration",0.01,100,1,ap.randomScaleDuration,function(v){
	ap.randomScaleDuration=v;
},[0.1,0.5,1]);
container.add(randomScaleDuration);

var useScaleRandomSameValue=new UI.CheckboxRow("Use Same Value",ap.useScaleRandomSameValue,function(v){
	ap.useScaleRandomSameValue=v;
});
container.add(useScaleRandomSameValue);

return container;
}
	