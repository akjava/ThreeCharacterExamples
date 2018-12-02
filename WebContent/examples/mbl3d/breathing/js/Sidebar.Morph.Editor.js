Sidebar.Morph.Editor=function(ap,key){
	this.key=key;
	var container=new UI.Div();
	//container.add(new UI.SubtitleRow(key));

	var expansionEnabled=new UI.CheckboxRow("Enable "+key,ap[key+'ExpansionEnabled'],function(v){
		ap[key+'ExpansionEnabled']=v;
	});
	container.add(expansionEnabled);
	
	var expansionMin=new UI.NumberButtons("Min Value",0,1,1,ap[key+'ExpansionMin'],function(v){
		ap[key+'ExpansionMin']=v;
	},[0,0.1,0.5,1]);
	container.add(expansionMin);

	var expansionMax=new UI.NumberButtons("Max Value",0,1,1,ap[key+'ExpansionMax'],function(v){
		ap[key+'ExpansionMax']=v;
	},[0,0.1,0.5,1]);
	container.add(expansionMax);

	var expansionInTime=new UI.NumberButtons("InTime",0.01,10,1,ap[key+'ExpansionInTime'],function(v){
		ap[key+'ExpansionInTime']=v;
	},[0.1,0.5,1]);
	container.add(expansionInTime);

	var expansionOutTime=new UI.NumberButtons("OutTime",0.01,10,1,ap[key+'ExpansionOutTime'],function(v){
		ap[key+'ExpansionOutTime']=v;
	},[0.1,0.5,1]);
	container.add(expansionOutTime);
	return container;
}