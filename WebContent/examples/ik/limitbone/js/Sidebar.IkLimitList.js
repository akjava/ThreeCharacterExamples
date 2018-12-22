Sidebar.IkLimitList=function(application){
	var ap=application;
	var scope=this;
	var container=new UI.TitlePanel("Ik Limit Test List");
	
	this.selectedIkName=null;
	
	
	var createIkCandiateBt=new UI.ButtonRow("crete Ik Limit List",function(){
		var ikName=scope.selectedIkName;
		var indices=ap.ikControler.iks[ikName];
		var joints=[];
		
		var end=-1;
		if(ikName=="LeftArm" || ikName=="RightArm" || ikName=="Head"){
			//no need hand
			end=-2;
		}
		
		for(var i=0;i<indices.length+end;i++){
			joints.push(indices[i]);
		}
		
		var boneList=BoneUtils.getBoneList(ap.skinnedMesh);
		
		var variation={};
		joints.forEach(function(joint){
			var name=boneList[joint].name;
			var min=ap.ikControler.ikLimitMin[name];
			var max=ap.ikControler.ikLimitMax[name];
			var objs=[];
			//possible values.
			for(var x=0;x<3;x++){
				for(var y=0;y<3;y++){
					for(var z=0;z<3;z++){
						if(x==1 && y==1 &&z==1){
							continue;
						}
							
							var xvalue=x==0?min.x:x==1?0:max.x;
							var yvalue=y==0?min.y:y==1?0:max.y;
							var zvalue=x==0?min.z:z==1?0:max.z;
							
							var obj={x:xvalue,y:yvalue,z:zvalue};
							objs.push(obj);
						
					}
				}
			}
			//remove duplicate
			var tmp={};
			var result=[];
			
			objs.forEach(function(obj){
				var key=obj.x+","+obj.y+","+obj.z;
				if(tmp[key]==undefined){
					result.push(obj);
				}
				tmp[key]="";
			});
			
			
			variation[name]=result;
		});
		
		var pattern=[];
		
		//convine
		function convine(index,angles){
			if(index==joints.length){
				pattern.push(angles);
			}else{
				
				var name=boneList[joints[index]].name;
				var objs=variation[name];
				for(var i=0;i<objs.length;i++){
					var newangles=[];
					if(angles!=null){
						angles.forEach(function(v){
							newangles.push(v);
						});
					}
					
					newangles.push(objs[i]);
					convine(index+1,newangles);
				}
			}
		}
			
		convine(0);
		
		console.log("generated ik list size",pattern.length);
		
		function patternToKey(pat){
			var key="";
			var index=0;
			pat.forEach(function(p){
				var name=boneList[joints[index]].name;
				key+=name+":"+p.x+","+p.y+","+p.z+"-";
				index++;
			});
			return key;
		}
		//console.log(patternToKey(pattern[pattern.length-1]));
		
		
		
		var options={};
		var index=0;
		pattern.forEach(function(p){
			var key=patternToKey(p);
			options[key]=index;
			index++;
		});
		
		
		patternList.setOptions(options);
		

		
		
		
		
		
		

		

		

		


		
		scope.onSelect=function(){
			var pat=pattern[patternList.getValue()];
			
			for(var i=0;i<pat.length;i++){
				var bone=boneList[joints[i]];
				var rads=AppUtils.degToRad(pat[i]);
				bone.rotation.set(rads.x,rads.y,rads.z);
				
				//AppUtils.printDeg(bone.rotation,bone.name);
			}
			ap.signals.poseChanged.dispatch();
		};
		
		
		scope.onPrev=function(){
			var select=parseInt(patternList.getValue())-1;
			if(select<0){
				return;
			}
			patternList.setValue(select);
			scope.onSelect();
		};
		scope.onNext=function(){
			var v=patternList.getValue();
			if(v==""){
				v=-1;
			}else{
				v=patternList.getValue();
			}
			
			var select=parseInt(v)+1;
			if(select>=pattern.length){
				return;
			}
			patternList.setValue(select);
			scope.onSelect();
		}
		
		
		
		
	});
	container.add(createIkCandiateBt);
	
	var ikNameSelect=new UI.ListRow("iks",[],function(v){
		scope.selectedIkName=v;
	});
	container.add(ikNameSelect);
	ikNameSelect.text.setWidth("30px");
	
	//finish init Ik
	ap.signals.boneLimitLoaded.add(function(){	
		var list=Object.keys(ap.ikControler.iks);
		ikNameSelect.setList(list);
		ikNameSelect.select.setValue(list[0]);
		scope.selectedIkName=list[0];
	});
	
	
	ap.signals.transformSelectionChanged.add(function(target){});
	var bts=new UI.ButtonRow("Prev",function(){scope.onPrev()});
	container.add(bts);
	this.prevBt=bts.button;
	this.nextBt=new UI.Button("Next").onClick(function(){scope.onNext()});
	bts.add(this.nextBt);
	
	
	var patternList=new UI.Select2().setMultiple(true).onClick(function(){scope.onSelect()});
	container.add(patternList);
	
	return container;
}