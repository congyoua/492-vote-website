var pic_num1,pic_num2;
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
                num = data.num;

        }).fail(function(err){
                alert(err.responseJSON.error);

        });
        return num;
}   

function getImg(){
        $("#images").show();
        $("#welcome").hide();
        pic_num1 = getNum();
        pic_num2 = getNum();

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

        var nums = {
                "pic_num1":pic_num1,
                "pic_num2":pic_num2,
                "choice":choice
        }
        // Put request with uer JSON and credential
        $.ajax({ 
	        method: "PUT", 
		url: "/api/submit",
		data: JSON.stringify(nums),
		processData:false, 
		contentType: "application/json; charset=utf-8",
		dataType:"json"
        // Update the new password to credential
	}).done(function(data, text_status, jqXHR){
		console.log("success");
	}).fail(function(err){
                alert(err.responseJSON.error);
	});
        getImg();
}

$(function(){
        
        $("#images").hide();
        $("#welcome").show();
        $("#start").on('click',function(){ getImg(); });
        $("#option1").on('click',function(){ submit(1); });
        $("#option2").on('click',function(){ submit(2); });
        $("#option3").on('click',function(){ submit(3); });
});