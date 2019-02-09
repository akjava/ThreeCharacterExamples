var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Physics Breast Bone Animation2"));
	
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	container.add( tabs );
	
	
	
	
	

	var breast=new Sidebar.Breast(ap);
	
	
	var animePanel=new BoneRotateAnimationPanel(application,{duration:10});

	
	var control=new UI.TitlePanel("Body");
	
	var meshTransparent=new UI.NumberButtons("Transparent",0,1,1,application.meshTransparent,function(v){
		application.meshTransparent=v;
		application.signals.meshTransparentChanged.dispatch();
	},[0,0.5,0.9,1.0]);
	control.add(meshTransparent);
	
	
	
	var visibleAmmo=new UI.CheckboxRow("Visible Ammo",application.visibleAmmo,function(v){
		application.visibleAmmo=v;
		application.signals.visibleAmmoChanged.dispatch();
	});
	control.add(visibleAmmo);

	
	

	
	var meshTransform=new Sidebar.MeshTransform(ap);
	
	
	
	var resetBt=new UI.ButtonRow("reset initial pos",function(){
		ap.breastControler.resetPosition();
	});
	
	
	
	
	var settingTab = new UI.Text( 'Setting' ).onClick( onClick );
	tabs.add( settingTab);
	var setting= new UI.Span().add(
			breast,control,meshTransform,resetBt
		);
	container.add( setting);

	var animationTab = new UI.Text( 'Animation' ).onClick( onClick );
	tabs.add( animationTab);
	var animation= new UI.Span().add(
			animePanel,new Sidebar.ClipPlayer(ap)
		);
	container.add( animation);

	var datasetTab = new UI.Text( 'Dataset' ).onClick( onClick );
	tabs.add( datasetTab);
	var dataset= new UI.Span().add(
			new LoadTexturePanel(ap)
		);
	container.add( dataset);
	
	
	

	function onClick( event ) {

		select( event.target.textContent );

	}
	
	function select( section ) {
		//move here
		settingTab.setClass( '' );
		setting.setDisplay( 'none' );
		animationTab.setClass( '' );
		animation.setDisplay( 'none' );
		datasetTab.setClass( '' );
		dataset.setDisplay( 'none' );
		switch ( section ) {



		case 'Setting':
						settingTab.setClass( 'selected' );
						setting.setDisplay( '' );
						break;
		

		case 'Animation':
						animationTab.setClass( 'selected' );
						animation.setDisplay( '' );
						break;
		

		case 'Dataset':
						datasetTab.setClass( 'selected' );
						dataset.setDisplay( '' );
						break;
		}
		//
		}
select('Setting');




	
	
	
	
	
	
	
	return container;
}
