//btTypedConstraint constraint, Line line,BodyAndMesh body1,BodyAndMesh body2
AmmoConstraintAndLine=function(constraint,line,body1,body2) {
		this.constraint = constraint;
		this.line = line;
		this.body1=body1;
		this.body2=body2!==undefined?body2:null;
		this.pivot0=null;//fixed for Point2PointConstraint
		this.forceSyncWhenHidden=false;
	}

Object.assign( AmmoConstraintAndLine.prototype, {
	constructor:AmmoConstraintAndLine,
	
	//from ammo-world to three.js
	sync:function(){
		
		if(this.line==null){
			return;
		}
		
		if(this.line.material.visible==false && this.forceSyncWhenHidden==false){
			return;
		}
		
		this.line.geometry.vertices[0].copy(this.body1.getMesh().position);
		
		if(this.body2!=null){
			//case 
			this.line.geometry.vertices[1].copy(this.body2.getMesh().position);
		}else{
			//case Point2PointConstraint
			if(this.pivot0!=null){
				this.line.geometry.vertices[1].copy(this.pivot0);
			}
		}
		this.line.geometry.verticesNeedUpdate=true;
	},
	getConstraint:function(){
		return this.constraint;
	},
	getLine:function(){
		return this.line;
	},
	setPivot0:function(pivot0){
		this.pivot0=pivot0;
	},
	getPivot0:function(){
		return this.pivot0;
	}
});



