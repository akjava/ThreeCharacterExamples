var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	container.add(new UI.AppName("Simple Geometry Cloth"));
	
	//ui
	var clothPanel=new UI.Panel();
	container.add(clothPanel);
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Cloth"));
	clothPanel.add(titleDiv);
	
	var visibleRow=new UI.Row().add(new UI.Text("Visible").setWidth("70px"));
	clothPanel.add(visibleRow)
	var visibleGeometry=new UI.CheckboxText("Geometry",application.visibleGeometry,function(v){
		application.visibleGeometry=v;
		application.signals.visibleChanged.dispatch();
	});
	visibleGeometry.text.setWidth("60px");
	visibleRow.add(visibleGeometry);
	
	var visibleAmmo=new UI.CheckboxText("Ammo",application.visibleAmmo,function(v){
		application.visibleAmmo=v;
		application.signals.visibleChanged.dispatch();
	});
	visibleRow.add(visibleAmmo);
	
	var visibleBall=new UI.CheckboxText("Ball",application.visibleBall,function(v){
		application.visibleBall=v;
		application.signals.visibleChanged.dispatch();
	});
	visibleRow.add(visibleBall);
	
	
	
	
	
	

	
	var bt=new UI.Button("New Cloth").onClick( function () {

		Example.newCloth(application);

	} );
	clothPanel.add(bt);
	
	var clothMass=new UI.NumberButtons("Total Mass",0,100,1,application.clothMass,function(v){
		application.clothMass=v;
	},[0.01,.1,1,10]);
	clothPanel.add(clothMass);
	
	var row1=new UI.Row().add(new UI.Text("Texture"));
	clothPanel.add(row1);
	var row1=new UI.Row();
	clothPanel.add(row1);
	
	var fileInput=new UI.BlobFile(".jpg,.png,.jpeg");
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,blobUrl){
		application.textureUrl=blobUrl;
		if(application.textureUrl==null){
			application.textureUrl=application.defaultTextureUrl;
		}
		application.signals.loadingTextureStarted.dispatch();
		application.signals.loadingTextureFinished.dispatch();
	});
	
	
	var springPanel=new UI.Panel();
	container.add(springPanel);
	var springTitle=new UI.Div().setClass("title").add(new UI.Text("Spring"));
	springPanel.add(springTitle);
	
	var damping=new UI.NumberButtons("Damping",0,200,1,application.damping,function(v){
		application.damping=v;
	},[0,.1,1,10]);
	springPanel.add(damping);
	
	var stiffness=new UI.NumberButtons("Stiffness",0,200,10,application.stiffness,function(v){
		application.stiffness=v;
	},[0,.1,1,10]);
	springPanel.add(stiffness);
	
	var linearLimit=new UI.NumberButtons("Linear Limit",0,10,1,application.linearLimit,function(v){
		application.linearLimit=v;
	},[0,.1,.5,1]);
	springPanel.add(linearLimit)
	
	var p2=new UI.Panel();
	container.add(p2);
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Particle"));
	p2.add(titleDiv);
	
	
	var gridColumns=new UI.IntegerButtons("Grid Columns",0,64,10,application.gridColumns,function(v){
		application.gridColumns=v;
		application.signals.gridSizeChanged.dispatch();
	},[2,8,16,32]);
	p2.add(gridColumns);
	var gridRows=new UI.IntegerButtons("Grid Rows",0,64,10,application.gridRows,function(v){
		application.gridRows=v;
		application.signals.gridSizeChanged.dispatch();
	},[2,8,16,32]);
	p2.add(gridRows);
	
	var particleSize=new UI.NumberButtons("Size",0,1,1,application.particleSize,function(v){
		application.particleSize=v;
	},[0,0.1,.5,1]);
	p2.add(particleSize);
	

	var groundFriction=new UI.NumberButtons("Friction",0,10,1,application.particleFriction,function(v){
		application.particleFriction=v;
		
	},[0,0.1,0.5,1]);
	p2.add(groundFriction);
	
	var groundRestitution=new UI.NumberButtons("Restituion",0,10,1,application.particleRestitution,function(v){
		application.particleRestitution=v;
	},[0,0.5,1]);
	p2.add(groundRestitution);
	
	var particleDamping=new UI.NumberButtons("Damping",0,1,1,application.particleDamping,function(v){
		application.particleDamping=v;
	},[0,.1,0.5,1]);
	p2.add(particleDamping);
	
	
	var constraintPanel=new UI.Panel();
	container.add(constraintPanel);
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Constraint"));
	constraintPanel.add(titleDiv);
	
	var disableCollisionsBetweenLinkedBodies=new UI.CheckboxRow("disable Collision",application.disableCollisionsBetweenLinkedBodies,function(v){
		application.disableCollisionsBetweenLinkedBodies=v;
	});
	constraintPanel.add(disableCollisionsBetweenLinkedBodies);
	
	var frameBRatio=new UI.NumberButtons("frameB Ratio",0,1,1,application.frameBRatio,function(v){
		application.frameBRatio=v;
	},[0,.5,0.9,1]);
	constraintPanel.add(frameBRatio);
	
	
	
	//
	var p1=new UI.Panel();
	container.add(p1);
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ball"));
	p1.add(titleDiv);
	
	var ballSize=new UI.NumberButtons("Size",0.01,16,1,application.ballSize,function(v){
		application.ballSize=v;
		application.signals.ballSizeChanged.dispatch();
	},[1,2,4,8]);
	p1.add(ballSize);

	
	var ballFriction=new UI.NumberButtons("Friction",0,10,1,application.ballFriction,function(v){
		application.ballFriction=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.1,0.5,1]);
	p1.add(ballFriction);
	
	var ballRestitution=new UI.NumberButtons("Restituion",0,10,1,application.ballRestitution,function(v){
		application.ballRestitution=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.5,1]);
	p1.add(ballRestitution);
	
	var bdamping=new UI.Panel();
	container.add(bdamping);
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ball-Damping"));
	bdamping.add(titleDiv);
	
	var linearDamping=new UI.NumberButtons("Linear",0,10,1,application.ballLinearDamping,function(v){
		application.ballLinearDamping=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.1,0.5,1]);
	bdamping.add(linearDamping);
	
	var angularDamping=new UI.NumberButtons("Angular",0,10,1,application.ballAngularDamping,function(v){
		application.ballAngularDamping=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.1,0.5,1]);
	bdamping.add(angularDamping);
	
	
	
	var ammoPanel=new UI.Panel();
	container.add(ammoPanel);
	ammoPanel.add(new UI.Div().setClass("title").add(new UI.Text("Ammo")));
	
	var ammoTimeSteps=new UI.IntegerButtons("Time 1.0/",0,240,10,application.ammoTimeSteps,function(v){
		application.ammoTimeSteps=v;
	},[15,30,60,120]);
	ammoPanel.add(ammoTimeSteps);
	
	var gravityY=new UI.NumberButtons("Gravity Y",-50,10,1,application.gravityY,function(v){
		application.gravityY=v;
		application.ammoControler.setGravity(0,application.gravityY,0);
	},[-50,-25,-9.8]);
	ammoPanel.add(gravityY);
	
	var testPanel=new UI.TitlePanel("Test");
	container.add(testPanel);
	
	//try to  soft moving
	var useLimitVelocity=new UI.CheckboxRow("Use Limit Velocity",application.disableCollisionsBetweenLinkedBodies,function(v){
		application.useLimitVelocity=v;
	});
	testPanel.add(useLimitVelocity);
	
	var limitVelocity=new UI.NumberButtons("Limit Velocity",0,20,10,application.gravityY,function(v){
		application.limitVelocity=v;
	},[0.1,1,5,10]);
	testPanel.add(limitVelocity);
	
	return container;
}
