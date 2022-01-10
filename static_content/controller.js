var num1,num2;
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
        num1 = getNum();
        num2 = getNum();

        $.ajax({
                url: "/api/getImg",
                headers: { "Authorization": num1 },
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
                headers: { "Authorization": num2 },
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



$(function(){
        
        $("#images").hide();
        $("#welcome").show();
        $("#start").on('click',function(){ getImg(); });
        //$("#submit").on('click',function(){ submit(); });
});