var pic_num1,pic_num2;
var id = -1;
var img_record = 1;
var firstN = 25;

// Get user's unique id
function getId(){
        $.ajax({
                method: "GET",
                url: "/api/getId",
                data: JSON.stringify({}),
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json",
                async: false
        }).done(function(data, text_status, jqXHR){
                id = data.id;
        }).fail(function(err){
                alert(err.responseJSON.error);

        });

}  

// Get id for images
function getNum(){
        var num = [-1,-1];
        $.ajax({
                method: "GET",
                url: "/api/getNum",
                data: {"record":img_record},
                contentType: "application/json; charset=utf-8",
                async: false
        }).done(function(data, text_status, jqXHR){
                num = data.num;
                img_record++;
        }).fail(function(err){
                alert(err.responseJSON.error);
        });     
        return num;
}   

// Get images from server
function getImg(){
        $("#images").show();
        $("#welcome").hide();
        var pic_nums = getNum();
        pic_num1 = pic_nums[0];
        pic_num2 = pic_nums[1];

        $.ajax({
                url: "/api/getImg",
                headers: { "Authorization": pic_num1 },
                xhrFields: {
                        responseType: 'blob'
                },
                success (data) {
                        
                        const url = window.URL || window.webkitURL;
                        const src = url.createObjectURL(data);
                        $('#image1').attr('src', src);
                }
        });
        $.ajax({
                url: "/api/getImg",
                headers: { "Authorization": pic_num2 },
                xhrFields: {
                        responseType: 'blob'
                },
                success (data) {
                        
                        const url = window.URL || window.webkitURL;
                        const src = url.createObjectURL(data);
                        $('#image2').attr('src', src);
                }
        });
        
}


function submit(choice){
        while(id === -1){getId();}
        var nums = {
                "pic_num1":pic_num1,
                "pic_num2":pic_num2,
                "choice":choice,
                "id":id
        }
        $.ajax({ 
	        method: "PUT", 
		url: "/api/submit",
		data: JSON.stringify(nums),
		processData:false, 
		contentType: "application/json; charset=utf-8",
		dataType:"json"
	}).done(function(data, text_status, jqXHR){
		//console.log("success");
                if(img_record>firstN){
                        //when the user makes more than firstN comparisons, switches to model results.
                        //switchMode();
                }
	}).fail(function(err){
                console.log(err);
	});
        
}



function switchMode(){
        $("#model").show();
        $("#images").hide();
        $("#welcome").hide();
        getRes();
        $("#yes").on('click',function(){ submit2(1); getRes();});
        $("#no").on('click',function(){ submit2(2); getRes();});  
}

function getRes(){
        while(id === -1){getId();}
        var num = [-1,-1,-1];
        $.ajax({
                method: "GET",
                url: "/api/getRes",
                data: {"id":id},
                contentType: "application/json; charset=utf-8",
                async: false
        }).done(function(data, text_status, jqXHR){
                num = data.num;
                if(num != [-1,-1,-1]){
                        if(num[2] === 0){$("#modelOutput").text("<");}
                        if(num[2] === 1){$("#modelOutput").text("=");}
                        if(num[2] === 2){$("#modelOutput").text(">");}
                        pic_num1 = nums[0];
                        pic_num2 = nums[1];
                        getImg2();
                }
        }).fail(function(err){
                alert(err.responseJSON.error);
        })
}

function getImg2(){
        $.ajax({
                url: "/api/getImg",
                headers: { "Authorization": pic_num1 },
                xhrFields: {
                        responseType: 'blob'
                },
                success (data) {
                        
                        const url = window.URL || window.webkitURL;
                        const src = url.createObjectURL(data);
                        $('#image3').attr('src', src);
                }
        });
        $.ajax({
                url: "/api/getImg",
                headers: { "Authorization": pic_num2 },
                xhrFields: {
                        responseType: 'blob'
                },
                success (data) {
                        
                        const url = window.URL || window.webkitURL;
                        const src = url.createObjectURL(data);
                        $('#image4').attr('src', src);
                }
        });    
}

function submit2(choice){
        while(id === -1){getId();}
        var nums = {
                "pic_num1":pic_num1,
                "pic_num2":pic_num2,
                "choice":choice,
                "id":id
        }
        $.ajax({ 
	        method: "PUT", 
		url: "/api/submit2",
		data: JSON.stringify(nums),
		processData:false, 
		contentType: "application/json; charset=utf-8",
		dataType:"json"
	}).done(function(data, text_status, jqXHR){
		//console.log("success");
	}).fail(function(err){
                console.log(err);
	});
        
}

$(function(){
        $("#images").hide();
        $("#model").hide();
        $("#welcome").show();
        while(id === -1)getId();
        $("#start").on('click',function(){ getImg(); $("#welcome").hide();});
        $("#option1").on('click',function(){ submit(1); getImg();});
        $("#option2").on('click',function(){ submit(2); getImg();});
        $("#option3").on('click',function(){ submit(3); getImg();});

});