var Target = [GenMscript, GenCscript, GenPscript, GenWscript, GenAscript, GenFlamePyscript];

function cookieValue( cookieName )
{
  thisCookie = document.cookie.split("; ");

  for (i=0; i < thisCookie.length; i++ ) {
     if ( cookieName == thisCookie[ i ].split("=")[0] ) { 
        return thisCookie[ i ].split("=")[1];
     }
  }
  return -1;
}


function setCookie()
{
   var OldNumOpers;

   author = document.myForm.author.value;
   document.cookie = "author=" + author;

   email = document.myForm.email.value;
   document.cookie = "email=" + email;

   FnName = document.myForm.FnName.value.replace(/\s+/g, "_");
   document.cookie = "FnName=" + FnName;

   FnType = document.myForm.FnType.value;
   document.cookie = "FnType=" + FnType;

   Variant = document.myForm.Variant.value;
   document.cookie = "Variant=" + Variant;

   OldNumOpers = cookieValue( "NumOpers" );

//   NumOpers = document.myForm.NumOpers.value;
   NumOpers = document.myForm.NumOpers.selectedIndex + 1;
   document.cookie = "NumOpers=" + NumOpers;

   Language = document.myForm.Language.value;
   document.cookie = "Language=" + Language;

   OperInfo = new Array();

   for (var i = 0; i < NumOpers; i++) {
      var curVarName  = document.getElementById('VarName' + i).value;
      var curTypeName = document.getElementById('TypeName' + i).value;
      var curDirName  = document.getElementById('DirName' + i).value;
      var curIoName   = document.getElementById('IoName' + i).value;

      document.cookie = "VarName" + i + "=" + curVarName;
      document.cookie = "TypeName" + i + "=" + curTypeName;

       // The following section is required in order to map the index from 
       // the vector direction array to the global (matrix) direction array.
       
      if (curTypeName == TYPE_VECTOR && 
          curDirName != '0') {
        curDirName = (parseInt(curDirName, 10) + 4).toString();
      }

      document.cookie = "DirName" + i + "=" + curDirName;
      document.cookie = "IoName" + i + "=" + curIoName;

      OperInfo.push(new Array(curVarName, curTypeName, curDirName, curIoName));
   }


/*
   if ( NumOpers > 0 ){
     VarName0 = document.myForm.VarName0.value;
     document.cookie = "VarName0=" + VarName0

     TypeName0 = document.myForm.TypeName0.value;
     document.cookie = "TypeName0=" + TypeName0

     DirName0 = document.myForm.DirName0.value;
     document.cookie = "DirName0=" + DirName0

     IoName0 = document.myForm.IoName0.value;
     document.cookie = "IoName0=" + IoName0 

     OperInfo[ 0 ] = Array( VarName0, TypeName0, DirName0, IoName0 );
   }

   if ( NumOpers > 1 ){
     VarName1 = document.myForm.VarName1.value;
     document.cookie = "VarName1=" + VarName1

     TypeName1 = document.myForm.TypeName1.value;
     document.cookie = "TypeName1=" + TypeName1

     DirName1 = document.myForm.DirName1.value;
     document.cookie = "DirName1=" + DirName1

     IoName1 = document.myForm.IoName1.value;
     document.cookie = "IoName1=" + IoName1 

     OperInfo[ 1 ] = Array( VarName1, TypeName1, DirName1, IoName1 );
   }

   if ( NumOpers > 2 ){
     VarName2 = document.myForm.VarName2.value;
     document.cookie = "VarName2=" + VarName2

     TypeName2 = document.myForm.TypeName2.value;
     document.cookie = "TypeName2=" + TypeName2

     DirName2 = document.myForm.DirName2.value;
     document.cookie = "DirName2=" + DirName2

     IoName2 = document.myForm.IoName2.value;
     document.cookie = "IoName2=" + IoName2 

     OperInfo[ 2 ] = Array( VarName2, TypeName2, DirName2, IoName2 );
   }

   if ( NumOpers > 3 ){
     VarName3 = document.myForm.VarName3.value;
     document.cookie = "VarName3=" + VarName3

     TypeName3 = document.myForm.TypeName3.value;
     document.cookie = "TypeName3=" + TypeName3

     DirName3 = document.myForm.DirName3.value;
     document.cookie = "DirName3=" + DirName3

     IoName3 = document.myForm.IoName3.value;
     document.cookie = "IoName3=" + IoName3 

     OperInfo[ 3 ] = Array( VarName3, TypeName3, DirName3, IoName3 );
   }

   if ( NumOpers > 4 ){
     VarName4 = document.myForm.VarName4.value;
     document.cookie = "VarName4=" + VarName4

     TypeName4 = document.myForm.TypeName4.value;
     document.cookie = "TypeName4=" + TypeName4

     DirName4 = document.myForm.DirName4.value;
     document.cookie = "DirName4=" + DirName4

     IoName4 = document.myForm.IoName4.value;
     document.cookie = "IoName4=" + IoName4 

     OperInfo[ 4 ] = Array( VarName4, TypeName4, DirName4, IoName4 );
   }
*/
   Target[Language](FnName, FnType, Variant, NumOpers, OperInfo, author, email);
}


function ResetCookie()
{
   if ( document.cookie != "" ) {
     thisCookie = document.cookie.split("; ");

     expireDate = new Date();
     expireDate.setDate( expireDate.getDate()-1 );

     for ( i=0; i<thisCookie.length; i++ ){ 
        cookieName = thisCookie[ i ].split("=")[ 0 ];
        document.cookie = cookieName + "=;expires=" + expireDate.toGMTString();
     }
   } 

   top.location.replace("index.html") ;
}  
