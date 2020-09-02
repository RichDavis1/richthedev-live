$(document).ready(function(){
    google.charts.load('current', {'packages': ['corechart']});

    google.charts.setOnLoadCallback(draw_ability_progress);
    
    $(document).on('click', '.answer-trigger', function(){
        var a = $(this).attr('data-a');
        var id = $("#testi").val();

        if(!id){
            startTest(a);
        }else{
            stepTest(id, a);
        }
    });

    function startTest(a){
        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },                        
            type: 'get',
            dataType: "json",
            url : '/cat/create',
            data: {
                a: a
            },    		
            success: function (data) { 
                if(data.result == 'success'){
                    var id = data.id;
                    $("#testi").val(id);
                    draw_ability_progress(data.ability_parameters);               
                }
            }
        });             
    }

    function stepTest(id, a){
        $.ajax({            
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },                        
            type: 'put',
            dataType: "json",
            url : '/cat/step/' + id,
            data: {
                a: a,
                id: id
            },    		
            success: function (data) { 
                if(data.result == 'success'){
                    draw_ability_progress(data.ability_parameters);                 
                }
            }
        });           
    }

    function draw_ability_progress(response=null) {
        var data = new google.visualization.DataTable();

        data.addColumn('number', 'Question');
        data.addColumn('number', 'Ability');
        data.addColumn('number', 'Lower Standard Error');
        data.addColumn('number', 'Upper Standard Error');
        data.addColumn('number', 'Difficulty');

        if(response){
            $.each(response, function(key,value){
                var i           = key + 1;			    
                var ability     = value.Ability;
                var se 			= value.SE;
                var lower_bound = ( ability - ( 1.96* se) );
                var upper_bound = ( ability + ( 1.96* se) );

                if(value.Logit){
                    var difficulty  = parseInt(value.Logit);	
                }else{
                    var difficulty  = parseInt(0);
                }	
                
                data.addRow([i, ability, lower_bound, upper_bound, difficulty]);    
            }); 
        }

        var areachart_options = 0;
        var areachart_options = {   
            seriesType: 'scatter',
            backgroundColor: '#eaedf6',

            hAxis: {
                format: 'short',
                title: 'Questions',
                textStyle: {
                    color: '#293f52',
                    fontSize: '12',
                    bold: true
                },					
            },

              vAxes: {
                  0: {
                      title: 'Difficulty',
                  },
                1: {
                  title:'Ability',
                  //textStyle: {color: 'red'}
                }
              },

            height: '285',
            width: '90%',
            chartArea: {'width': '60%', 'height': '65%', 'right': 75, 'left': 75, 'bottom': 80},
            legend: {
                position: 'bottom',
                textStyle: {color: '#293f52'}
            },
            
            series: {                                 
                3: {targetAxisIndex: 0,
                    type: 'line'},
                1: {targetAxisIndex: 1},
                2: {targetAxisIndex: 1},                   
                0: {targetAxisIndex: 1}
                    
            },
        };

        var chart = new google.visualization.ComboChart(document.getElementById('ability-chart'));
        chart.draw(data, areachart_options);      
    }	    	

    function draw_empty() {
        var data = new google.visualization.DataTable();

        data.addColumn('number', 'Question');
        data.addColumn('number', 'Ability');
        data.addColumn('number', 'Lower Standard Error');
        data.addColumn('number', 'Upper Standard Error');
        data.addColumn('number', 'Difficulty');

        /*
        $.each(response, function(key,value){
            var i           = key + 1;			    
            var ability     = value.ability;
            var se 			= value.se;
            var lower_bound = ( ability - ( 1.96* se) );
            var upper_bound = ( ability + ( 1.96* se) );

            if(value.logit){
                var difficulty  = parseInt(value.logit);	
            }else{
                var difficulty  = parseInt(0);
            }	
            
            data.addRow([i, ability, lower_bound, upper_bound, difficulty]);    
        }); 
        */

        var areachart_options = 0;
        var areachart_options = {   
            seriesType: 'scatter',
            backgroundColor: '#eaedf6',

            hAxis: {
                format: 'short',
                title: 'Questions',
                textStyle: {
                    color: '#293f52',
                    fontSize: '12',
                    bold: true
                },					
            },

              vAxes: {
                  0: {
                      title: 'Ability',
                  },
                1: {
                  title:'Difficulty',
                  //textStyle: {color: 'red'}
                }
              },

            height: '285',
            width: '90%',
            chartArea: {'width': '60%', 'height': '65%', 'right': 75, 'left': 75, 'bottom': 80},
            legend: {
                position: 'bottom',
                textStyle: {color: '#293f52'}
            },
            
            series: {                                 
                3: {targetAxisIndex: 1,
                    type: 'line'},
                1: {targetAxisIndex: 0},
                2: {targetAxisIndex: 0},                   
                0: {targetAxisIndex: 0}
                    
            },
        };

        var chart = new google.visualization.ComboChart(document.getElementById('ability-chart'));
        chart.draw(data, areachart_options);
    }    




});