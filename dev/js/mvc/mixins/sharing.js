define([], function(){
	var sharing;

	sharing = {
		toggleSelector : "",
		menuSelector: "",
		toggleClass : "",

		bindSharing : function(opts){
			var that = this;

			if(opts){
				this.toggleSelector = opts.toggleSelector || this.toggleSelector;
				this.menuSelector = opts.menuSelector || this.menuSelector;
				this.toggleClass = opts.toggleClass || this.toggleClass;
			}

			this.$toggle = $(this.toggleSelector);
			this.$menu = $(this.menuSelector);

			this.$toggle.parent().on('click', this.$toggle, function(e){
				e.preventDefault();

				that.toggleState();

				return false;
			});
		},

		toggleState : function(){
			this.$menu.toggleClass(this.toggleClass);
		}
	};

	return sharing;
});