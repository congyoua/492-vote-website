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
                        //当客户端本地记录已投票firstN个图片后，触发切换模式
                        switchMode();
                }
	}).fail(function(err){
                console.log(err);
	});
}


//在上面触发，关掉投票页面，打开”正在训练“页面，同时调用trainmodel()
function switchMode(){   
        console.log("swit"); 
        $("#images").hide();
        $("#welcome").hide();
        $("#train").show();
        trainModel();
}

//ajax告诉服务端，需要训练模型了。
function trainModel(){
        var nums = {
                "id":id
        }
        $.ajax({ 
	        method: "PUT", 
		url: "/api/train",
		data: JSON.stringify(nums),
		processData:false, 
		contentType: "application/json; charset=utf-8",
		dataType:"json"
	}).done(function(data, text_status, jqXHR){

                //当服务端返回训练完之后，关掉“正在训练”页面，然后显示模型展示页面和next按钮
                //调用下面的getRes，并绑定next按钮
                console.log("finishtrain");
                $("#train").hide();
                $("#model").show();
                getRes();
                $("#next").on('click',function(){getRes();});
	}).fail(function(err){
                console.log(err);
	});
}

//从服务端申请2个随即图片，以及python预测的结果，0/1/2代表<=>
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
                //服务端模型预测完了，返回[图片序列号1，图片序列号2，预测结果]
                //getImg同上，拿着序列号，去数据库拿图片来显示
                num = data.num;
                if(num != [-1,-1,-1]){
                        if(num[2] === 0){$("#modelOutput").text("<");}
                        if(num[2] === 1){$("#modelOutput").text("=");}
                        if(num[2] === 2){$("#modelOutput").text(">");}
                        pic_num1 = num[0];
                        pic_num2 = num[1];
                        console.log("got nunm!");
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

$(function(){
        $("#images").hide();
        $("#training").hide();
        $("#model").hide();
        $("#welcome").show();
        while(id === -1)getId();
        $("#start").on('click',function(){ $("#images").show();$("#welcome").hide();getImg();});
        $("#option1").on('click',function(){ submit(1); getImg();});
        $("#option2").on('click',function(){ submit(2); getImg();});
        $("#option3").on('click',function(){ submit(3); getImg();});

});