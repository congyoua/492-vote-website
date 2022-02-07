var pic_num1,pic_num2;
var id = -1;

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
        var num = -1;
        $.ajax({
                method: "GET",
                url: "/api/getNum",
                data: JSON.stringify({}),
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json",
                async: false
        }).done(function(data, text_status, jqXHR){
                num = {num1: data.num1, num2: data.num2};
                // console.log(num);

        }).fail(function(err){
                alert(err.responseJSON.error);

        });
        return num;
}   

// Get images from server
function getImg(){
        $("#images").show();
        $("#welcome").hide();
        let nums = getNum();
        pic_num1 = nums.num1;
        pic_num2 = nums.num2;

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
	}).fail(function(err){
                console.log(err);
	});
        
}

$(function(){
        $("#images").hide();
        $("#welcome").show();
        while(id === -1)getId();
        $("#start").on('click',function(){ getImg(); $("#welcome").hide();});
        $("#option1").on('click',function(){ submit(1); getImg();});
        $("#option2").on('click',function(){ submit(2); getImg();});
        $("#option3").on('click',function(){ submit(3); getImg();});
});