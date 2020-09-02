$(document).ready(function(){  
    function resetDisplayContainer(container){
        $('.bar-item').each(function(){
            $(this).removeClass('active');
        });

        $(".ac").each(function(){
            $(this).removeClass('display').addClass('hidden');
        });

        $("#" + container).removeClass('hidden').addClass('display');
        $(".bar-item[data-container='" + container + "'").addClass('active');
    }
    
    $(document).on('click', '.abt', function(){
        var selection = $(this);
        var container = selection.attr('data-container');
        var endpoint = selection.attr('data-r');

        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),            
                'Accept': 'application/json'                
            },                            
            type: 'get',
            dataType: "json",
            url : '/api/admin/'+endpoint+'/get',
            data: {},  		
            success: function (data) { 
                if(data.result == 'success'){
                    $('#'+container).empty().append(data.view);
                    tinyMCE.remove();
                    addTinyMCE('post-content');
                    resetDisplayContainer(container);
                }                
            }
        });        
    });    

    $(document).on('click', '#create-post', function(){
        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),                 
                'Accept': 'application/json'                
            },                        
            type: 'get',
            dataType: "json",
            url : 'api/problem/create',
            data: {},  		
            success: function (data) { 
                if(data.result == 'success'){
                    $("#admin-create").empty().append(data.view);
                    tinyMCE.remove();
                    addTinyMCE('post-content');
                    resetDisplayContainer('admin-create');
                }                
            }
        });
    });

    $(document).on('click', '#save-post', function(){
        var title = $("#title").val();
        var content = tinyMCE.get('post-content').getContent();
        var categories = compileCategories();
        var github_link = $("#github_link").val();
        var composer_link = $("#composer_link").val();
        var post_status = $("#status").val();  
        var read_time = $("#read_time").val();      

        if(!title){
            return false;
        }

        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                        
            type: 'post',
            dataType: "json",
            url : '/api/problem/store',
            data: {
                title: title,
                content: content,
                categories: categories,
                github_link: github_link,
                composer_link: composer_link,
                status: post_status,
                read_time: read_time           
            },    		
            success: function (data) { 
                if(data.result == 'success'){
                    $("#admin-create").empty().append(data.view);

                    tinyMCE.remove();
                    addTinyMCE('post-content');
                    resetDisplayContainer('admin-create');                      
                }
            }
        });        
    });

    $(document).on('click', '#delete-post', function(){
        var id = $(this).attr('data-postid');

        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                        
            type: 'get',
            dataType: "json",
            url : '/api/problem/'+id+'/delete',
            data: {
                id: id
            },   		
            success: function (data) { 
                if(data.result == 'success'){
                    Core.clear_modals();

                    $('html').append(data.modal);
                    $("#deleteProblemModal").modal('show').css('display', 'block');	                  
                }
            }
        });        
    });    

    $(document).on('click', '#confirm-deletion', function(){
        var id = $(this).attr('data-id');

        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                        
            type: 'post',
            dataType: "json",
            url : '/api/problem/'+id+'/destroy',
            data: {
                id: id
            },   		
            success: function (data) { 
                if(data.result == 'success'){
                    $("#admin-posts").empty().append(data.view);

                    tinyMCE.remove();
                    addTinyMCE('post-content');
                    resetDisplayContainer('admin-posts');
    
                    $("#deleteProblemModal").modal('hide').css('display', 'none');	                    
                }
            }
        });        
    });   

    $(document).on('click', '.edit-post-trigger', function(){
        var postId = $(this).attr('data-postid');

        if(!postId){
            return false;
        }

        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                      
            type: 'get',
            dataType: "json",
            url : '/api/problem/'+postId+'/edit',
            data: {
                postId: postId,
            },    		
            success: function (data) { 
                if(data.result == 'success'){
                    $("#admin-create").empty().append(data.view);

                    tinyMCE.remove();
                    addTinyMCE('post-content');
                    resetDisplayContainer('admin-create');
                }   
            }
        });        
    });  

    $(document).on('click', '#update-post', function(){
        var id = $(this).attr('data-postid');
        var title = $("#title").val();
        var content = tinyMCE.get('post-content').getContent();
        var categories = compileCategories();
        var github_link = $("#github_link").val();
        var composer_link = $("#composer_link").val();
        var post_status = $("#status").val();
        var read_time = $("#read_time").val();

        if(!id || !title){
            return false;
        }
        
        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                         
            type: 'post',
            dataType: "json",
            url : '/api/problem/'+id+'/update',
            data: {
                id: id,
                title: title,
                content: content,
                categories: categories,
                github_link: github_link,
                composer_link: composer_link,
                status: post_status,
                read_time: read_time
            },    		
            success: function (data) {              
                if(data.result == 'success'){
                    $("#admin-create").empty().append(data.view);

                    tinyMCE.remove();
                    addTinyMCE('post-content');
                    resetDisplayContainer('admin-create');                    
                }
            }
        });  
    });    

    $(document).on('click', '#add-category', function(){        
        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                         
            type: 'get',
            dataType: "json",
            url : '/api/category/create',
            data: {},    		
            success: function (data) { 
                if(data.result == 'success'){
                    Core.clear_modals();

                    $('html').append(data.modal);
                    $("#addCategoryModal").modal('show').css('display', 'block');	                  
                }
            }
        });  
    });

    $(document).on('submit', '#addCategory', function(e){
        e.preventDefault();

        var loginForm = $("#addCategory");
        var formData = loginForm.serialize();

        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                             
            type: 'post',
            dataType: "json",
            url : '/api/category/store',
            data: formData,    		
            success: function (data) { 
                if(!data.result){
                    errorLabel('invalid', 'Incorrect email or password');
                    return false;
                } 

                $("#admin-settings").empty().append(data.view);

                tinyMCE.remove();
                addTinyMCE('post-content');
                resetDisplayContainer('admin-settings');

                $("#addCategoryModal").modal('hide').css('display', 'none');	  
            }
        });
    }); 

    $(document).on('click', '.remove-category', function(){
        var categoryId = $(this).attr('data-categoryId');

        if(!categoryId){
            return false;
        }

        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                         
            type: 'post',
            dataType: "json",
            url : url = 'api/category/' + categoryId + '/destroy',
            data: {},    		
            success: function (data) { 
                if(!data.result){
                    return false;
                } 

                $("#admin-settings").empty().append(data.view);

                tinyMCE.remove();
                addTinyMCE('post-content');
                resetDisplayContainer('admin-settings');
            }
        });
    });

    $(document).on('click', '.save-field', function(){
        var selection = $(this);
        var field = selection.attr('data-field');
        var value = $("#" + field).val();
        var value = (value ? value : null);

        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + $('meta[name="api-token"]').attr('content'),             
                'Accept': 'application/json'                  
            },                         
            type: 'post',
            dataType: "json",
            url : url = 'api/adminsettings/update',
            data: {
                field: field,
                value: value
            },    		
            success: function (data) { 
                if(!data.result){
                    return false;
                } 

                $("#admin-settings").empty().append(data.view);

                tinyMCE.remove();
                addTinyMCE('post-content');
                resetDisplayContainer('admin-settings');
            }
        });        
    });

    $(document).on('focus', '.admin-setting', function(){
        var selection = $(this);
        selection.next('.setting-actions').css('display', 'flex');
    });

    $(document).on('click', '.close-prompt', function(){
        $(this).parents('.setting-actions').css('display', 'none');
    });

    $(document).on('click', '.expand-message', function(){
        var selection = $(this);
        var id = selection.attr('data-id');
        var status = selection.attr('data-status');

        if(status == 'closed'){
            $("#"+id+'-expanded').css('display', 'block');
            selection.attr('data-status', 'open');
            selection.css('transform', 'rotate(180deg)');
        }else{
            $("#"+id+'-expanded').css('display', 'none');       
            selection.attr('data-status', 'closed');
            selection.css('transform', 'none');                 
        }
    });

    $(document).on('input', '#post-content', function(){  
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });    

    $(document).on('click', '.dheader', function(){   
        var selection = $(this);   
        var status = selection.attr('data-status');

        if(status == 'opened'){
            selection.attr('data-status', 'closed');
            selection.next('.dropdown-body').css('display', 'none');                 
        }else{
            selection.attr('data-status', 'opened');
            selection.next('.dropdown-body').css('display', 'block');            
        }
    });

    $(document).on('click','.select-category-trigger', function(){
        var selection   = $(this);
        var status = selection.attr('data-status');

        if(status == 'active'){
            selection.removeClass('active').addClass('inactive');
            selection.attr('data-status', 'inactive');
            selection.find('.checkmark-box').css('display', 'block');            
            selection.find('.checkmark').css('display', 'none');
        }else if(status == 'inactive'){
            selection.removeClass('inactive').addClass('active');
            selection.attr('data-status', 'active');
            selection.find('.checkmark-box').css('display', 'none');            
            selection.find('.checkmark').css('display', 'flex');
        }
    });   

    function compileCategories(){
        var categories = [];

        $('.select-category-trigger.active').each(function(){
            var categoryId = $(this).attr('data-id');
            categories.push(categoryId);
        });

        if(categories.length){
            return categories;
        }

        return null;
    }

    $(document).on('change', '#status', function(){
        var status = $(this).val();

        $("#post-status").empty().append(status);
    });

    $(document).on('click', '#edit-status', function(){
        console.log('yo');
        var selection = $(this);
        var status = selection.attr('data-status');

        if(status == 'closed'){
            selection.removeClass('fa-pencil').addClass('fa-times');
            selection.attr('data-status', 'open');
            $("#status-wrapper").css('display', 'block');
        }else{
            selection.removeClass('fa-times').addClass('fa-pencil');
            selection.attr('data-status', 'closed');            
            $("#status-wrapper").css('display', 'none');
        }
    });    

    function addTinyMCE(container){
        tinymce.init({
            selector: '#' + container,
            statusbar: false,     
            body_class: "tiny-ta",
            content_style: ".tiny-ta{color: #fff;background-color:#6b6b6b;cursor:text;}",      
            force_br_newlines : false,
            force_p_newlines : false,
            forced_root_block : '',    

            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste autoresize"    
            ]                                             
        });
    }

    $(function() {
        tinymce.init({
            selector: '.editor-box',
            statusbar: false,     
            body_class: "tiny-ta",
            mode : "textareas",
            theme : "advanced",
            force_br_newlines : false,
            force_p_newlines : false,
            forced_root_block : '',            
            content_style: ".tiny-ta{color: #fff;background-color:#6b6b6b;cursor:text;}",            

            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste"    
            ]                                   
        });
    });

}); 