var pic_num1,pic_num2;
var id = -1;
var img_record = 1;

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
<<<<<<< HEAD
                num = {num1: data.num1, num2: data.num2};
                // console.log(num);

=======
                num = data.num;
                img_record++;
>>>>>>> 954e72b0f0503b8c2e87a9fcfb1ccd8314d67f11
        }).fail(function(err){
                alert(err.responseJSON.error);
        });     
        return num;
}   

// Get images from server
function getImg(){
        $("#images").show();
        $("#welcome").hide();
<<<<<<< HEAD
        let nums = getNum();
        pic_num1 = nums.num1;
        pic_num2 = nums.num2;
=======
        var pic_nums = getNum()
        pic_num1 = pic_nums[0];
        pic_num2 = pic_nums[1];
>>>>>>> 954e72b0f0503b8c2e87a9fcfb1ccd8314d67f11

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