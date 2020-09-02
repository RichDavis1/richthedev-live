window.Core = {
    clear_modals: function(){
        $( ".called-modal" ).each(function() {
            $(this).remove();
        });	      
    }
}