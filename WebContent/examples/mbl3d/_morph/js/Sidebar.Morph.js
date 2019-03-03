Sidebar.Morph = function ( application ) {
	var scope=this;
	var container = new UI.Panel();
	container.setId( 'Morph' );
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Morph"));
	//container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var morphList=new UI.Select();
	morphList.onChange(function(){
		application.morphAnimationIndex=morphList.getValue();
		application.signals.morphAnimationSelectionChanged.dispatch();
		if(scope.autoPlay){
			application.signals.morphAnimationStarted.dispatch();
		}
	})
	row1.add(morphList);
	
	
	var row2=new UI.Row();
	container.add(row2);
	
	var row2text=new UI.Text("Time").setWidth( '90px' );
	row2.add(row2text);
	
	var timeNumber=new UI.Number().setWidth('60px');;
	timeNumber.min=0;
	timeNumber.max=10;
	timeNumber.step=0.5;
	timeNumber.unit=" sec";
	timeNumber.setValue(application.animationTime);
	
	
	function updateAnimationTime(){
		application.animationTime=timeNumber.getValue();
		if(scope.autoPlay){
		application.signals.morphAnimationStarted.dispatch();
		}
	}
	timeNumber.onChange(function(){
		updateAnimationTime();
	});
	row2.add(timeNumber);
	
	row2.add(new UI.Button("0.1").onClick(function(){timeNumber.setValue(0.1);updateAnimationTime()}));
	row2.add(new UI.Button("0.5").onClick(function(){timeNumber.setValue(0.5);updateAnimationTime()}));
	row2.add(new UI.Button("1.0").onClick(function(){timeNumber.setValue(1.0);updateAnimationTime()}));
	
	
	var row3=new UI.Row();
	container.add(row3);
	var row3text=new UI.Text("Both Direction").setWidth( '90px' );
	row3.add(row3text);
	
	var directionCheck=new UI.Checkbox();
	directionCheck.setValue(application.animationDirection);
	
	
	
	directionCheck.onChange(function(){
		application.animationDirection=directionCheck.getValue();
		if(scope.autoPlay){
		application.signals.morphAnimationStarted.dispatch();
		}
	});
	row3.add(directionCheck);
	
	var row4=new UI.Row();
	container.add(row4);
	var row4text=new UI.Text("Max Value").setWidth( '90px' );
	row4.add(row4text);
	
	var maxNumber=new UI.Number().setWidth('60px');
	maxNumber.min=0;
	maxNumber.max=1;
	maxNumber.step=0.5;
	maxNumber.setValue(application.animationMaxValue);
	
	function updateAnimationMaxValue(){
		application.animationMaxValue=maxNumber.getValue();
		application.signals.morphAnimationSelectionChanged.dispatch();
		
		if(scope.autoPlay){
		application.signals.morphAnimationStarted.dispatch();
		}
	}
	
	maxNumber.onChange(function(){
		updateAnimationMaxValue();
	});
	row4.add(maxNumber);
	
	row4.add(new UI.Button("0.5").onClick(function(){maxNumber.setValue(0.5);updateAnimationMaxValue()}));
	row4.add(new UI.Button("0.7").onClick(function(){maxNumber.setValue(0.7);updateAnimationMaxValue()}));
	row4.add(new UI.Button("1.0").onClick(function(){maxNumber.setValue(1.0);updateAnimationMaxValue()}));
	
	
	var row5=new UI.Row();
	container.add(row5);
	var bt1=new UI.Button("Play");
	bt1.onClick(function(){
		application.signals.morphAnimationStarted.dispatch();
	})
	row5.add(bt1);
	
	var bt2=new UI.Button("Stop");
	bt2.onClick(function(){
		application.signals.morphAnimationFinished.dispatch();
		application.signals.morphAnimationSelectionChanged.dispatch();
	})
	row5.add(bt2);
	bt2.setDisabled(true);
	
	application.signals.morphAnimationStarted.add(function(){
		bt1.setDisabled(true);
		bt2.setDisabled(false);
	});
	application.signals.morphAnimationFinished.add(function(){
		bt1.setDisabled(false);
		bt2.setDisabled(true);
	});
	
	
	this.autoPlay=false;
	row5.add(new UI.Text("Auto play"));
	var autoPlayCheck=new UI.Checkbox();
	row5.add(autoPlayCheck);
	autoPlayCheck.setValue(this.autoPlay);
	autoPlayCheck.onChange(function(){
		scope.autoPlay=autoPlayCheck.getValue();
	});
	
	//hook
	application.signals.loadingModelFinished.add(function(){
		var header="Expressions_";
		
		
		//swap and shorten
		var options={};
		
		for ( var key in application.skinnedMesh.morphTargetDictionary ) {
			options[application.skinnedMesh.morphTargetDictionary[key]]=key.substring(header.length,key.length);	
		}
		
		morphList.setOptions(options);
		morphList.setValue(0);//TODO keep value?
		
		application.signals.morphAnimationFinished.dispatch();
	})
	
	
	return container;
};
