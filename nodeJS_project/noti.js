//v1
//Xử lý nhiều ngoại lệ -> try-catch nhiều lần
setTimeout(function(){
    console.log("A");
},0);

console.log("B");

setTimeout(function () {
  console.log("c");
}, 0);

Promise.resolve().then(
    function(){
        console.log("D");
    },

    setTimeout(function(){
        console.log("E");
    },10)
)