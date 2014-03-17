function random_array(n, arr){
  for (var i =0; i != n; ++i)
    arr.push(Math.ceil(Math.random()*3) * 
             Math.pow(-1,Math.floor(Math.random()*2)));
}
function unitfy(arr,lda){
  var n = Math.sqrt(arr.length);
  for (var i = 0; i != n; ++i){
    arr[i*lda+i] = 1;
  }
}

function triangularize(arr, upper){
  var n = Math.sqrt(arr.length);

  for (var i = 0; i!= n; ++i){
    for (var j = i+1; j!= n; ++j){
      if (!upper){
         arr[i*n+j]=0;
      }
      else{
         arr[j*n+i]=0;
      }
    }
  }

}
function multiply_matrix(m, n, k, AA, lda, BB, ldb, CC, ldc){
  //assume column major order
  for (var i0 = 0; i0 != n; ++i0){
    for (var i1 = 0; i1 != m; ++i1){
      for (var i2 = 0; i2 != k; ++i2){
        CC[i0*ldc+i1] += AA[i2*lda+i1] * BB[i0*ldb+i2];
      }
    }
  }
}

function zero_array(n, arr){
  if (arr.length >=n){
      for (var i = 0; i != arr.length; ++i)
	  arr[i] = 0;
  }
  else{
    for (var i =0; i != n; ++i)
      arr.push(0);
  }
}