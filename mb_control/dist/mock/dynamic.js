module.exports=function(a,t){var d={code:0,message:"",data:""};d.data={},d.data.id=Math.floor(1e4*Math.random()),t.write(JSON.stringify(d)),t.end()};