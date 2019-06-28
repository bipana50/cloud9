var scores= [90,98,89,100,100,86,94];

var scores2= [40,65,77,82,80,54,73,63,95,49];

function average(array1){
     var sum =0;
    for( var i=0; i<array1.length; i++){
    sum= sum + array1[i]; }
    var y= sum/array1.length;
    console.log(Math.round(y));
}

average(scores);
average(scores2);