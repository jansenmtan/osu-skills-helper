// from https://osuskills.com/pages/training/script.js

$(window).load(function(){
	$( function() {
		$( ".slider-range" ).slider({
		  range: true,
		  min: 0,
		  max: 2000,
		  values: [ 100, 1000 ],
		  change: function( event, ui ) {
			 if($(this).prev(".skillLabel").prop("checked"))
				 $(this).prev(".skillLabel").click();
			 $(this).parent().children(".min").val(ui.values[ 0 ]);
			 $(this).parent().children(".max").val(ui.values[ 1 ]);
		  },
		  slide: function( event, ui ) {
			 $(this).next(".min").val(ui.values[ 0 ]);
			 $(this).next(".min").next(".max").val(ui.values[ 1 ]);
		  }
		});
				
		$( ".min" ).change(function( event ) {
			var curSlider = $(this).parent().children(".slider-range");
			var curVal = curSlider.slider("values")[0];
			var maxVal = curSlider.slider("values")[1];
			var newVal = $(this).val();
			if(newVal >= maxVal || isNaN(parseInt(newVal)) || !isFinite(newVal))
				curSlider.slider("values", 0, curVal);
			else
				curSlider.slider("values", 0, $(this).val());
		  //event.preventDefault();
		});
		
		$( ".max" ).change(function( event ) {
			var curSlider = $(this).parent().children(".slider-range");
			var curVal = curSlider.slider("values")[1];
			var minVal = curSlider.slider("values")[0];
			var newVal = $(this).val();
			if(newVal <= minVal || isNaN(parseInt(newVal)) || !isFinite(newVal))
				curSlider.slider("values", 1, curVal);
			else
				curSlider.slider("values", 1, $(this).val());
		  //event.preventDefault();
		})
	});
});
