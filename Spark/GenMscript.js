function GenMscript( FnName, FnType, Variant, NumOpers, OperInfo, author, email ){
  var str="", notfirst=0, i;
  var curDate = new Date();

  str += "<html><pre><code>\n";
  /*
  str += "% Copyright "+curDate.getFullYear();

  now = new Date
  for ( i=2004; i<now.getYear()+1; i++ )
    str += ", "+i;

  str += " The University of Texas at Austin\n";

  str += "%\n";
  str += "% For licensing information see\n";
  str += "%                http://www.cs.utexas.edu/users/flame/license.html \n";
  str += "%                                                                                 \n";  
  */
  str += "% Programmed by: "+author+"\n";
  str += "%                "+email+"\n\n";
  
  str += MHeader( FnName, FnType, Variant, NumOpers, OperInfo );

  str += MPartition( FnName, FnType, Variant, NumOpers, OperInfo );

  str += MGuard( FnName, FnType, Variant, NumOpers, OperInfo );

  str += MRepartition( FnName, FnType, Variant, NumOpers, OperInfo );

  str += indent+indent+"%"+repeat( 60, '-' )+"%\n\n";

  str += indent+indent+"%"+repeat(22, ' ')+" update line 1 "+repeat(23,' ')+"%\n";

  str += indent+indent+"%"+repeat(22, ' ')+"       :       "+repeat(23,' ')+"%\n";

  str += indent+indent+"%"+repeat(22, ' ')+" update line n "+repeat(23,' ')+"%\n\n";

  str += indent+indent+"%"+repeat( 60, '-' )+"%\n\n";

  str += MContinue( FnName, FnType, Variant, NumOpers, OperInfo );

  str += MFooter( FnName, FnType, Variant, NumOpers, OperInfo );

  str += "\n</code></pre></html>";

  with (parent.frames[1].document){
     open();
     writeln( str );
     close();
  }

  return false;
}

function MHeader( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i;
  var firsttime = 1;

  str = "function [ ";

  for ( i=0; i<NumOpers; i++ ){
    if ( OperInfo[ i ][ 3 ] > 0 ){
      if ( firsttime == 0 )
         str += ", ";
      else
         firsttime = 0;
      str += AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
      if ( OperInfo[ i ][ 1 ] == '1' && ( OperInfo[ i ][ 2 ] == '5' || OperInfo[ i ][ 2 ] == '6' ) )
         str += "t";
      str += "_out";
    } 
  }

  str += " ] = ";
  
  str += FnName+"_"+BlkChoicesShort[ FnType ];
  if ( Variant != '0' )
    str +="_var"+Variant;
  str += "( ";

  firsttime = 1;

  for ( i=0; i<NumOpers; i++ ){
    if ( OperInfo[ i ][ 3 ] != 1 ){
      if ( firsttime == 0 )
         str += ", ";
      else
         firsttime = 0;
      str += AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
      if ( OperInfo[ i ][ 1 ] == '1' && ( OperInfo[ i ][ 2 ] == '5' || OperInfo[ i ][ 2 ] == '6' ) )
         str += "t";
    } 
  }

  if ( FnType != '0' ) str += ", nb_alg";

  str += " )\n\n";

  return str;
}

function MGuard( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str = "";
  var i; 

  for (i=0; i<NumOpers; i++ ){
    if ( OperInfo[ i ][ 2 ] != '0' ) break;
  }

  if ( i == parseInt( NumOpers ) ){
    str = "No variable to split";   
    return str; 
  }

  c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];

  str = indent+"while ( size( "+c;

  switch( OperInfo[ i ][ 2 ] ){
  case '1': str += "TL, 1 ) < size( "+c+", 1 ) )\n\n"; 
          break;
  case '2': str += "BR, 1 ) < size( "+c+", 1 ) )\n\n"; 
          break;
  case '3': str += "TR, 1 ) < size( "+c+", 1 ) )\n\n";
          break;
  case '4': str += "BL, 1 ) < size( "+c+", 1 ) )\n\n";
          break;
  case '5': str += "L";
          if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
          str += ", 2 ) < size( "+c;
          if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
          str += ", 2 ) )\n\n"; 
          break;
  case '6': str += "R";
          if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
          str += ", 2 ) < size( "+c+", 2 ) )\n\n"; 
          if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
          break;
  case '7': str += "T, 1 ) < size( "+c+", 1 ) )\n\n"; 
          break;
  case '8': str += "B, 1 ) < size( "+c+", 1 ) )\n\n"; 
          break;
  }

  return str;
}

function MPartition( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i;
  var c;

  for (i=0; i<NumOpers; i++ ){
     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( OperInfo[ i ][ 1 ] == '2' ){
	     c = MChoices[ OperInfo[ i ][ 0 ] ];           

             str += indent+"[ "+c+"TL, "+c+"TR, ...\n";
             str += indent+"  "+c+"BL, "+c+"BR ] = FLA_Part_2x2( "+c+", ...\n";
             str += indent+"                             0, 0, "; 
             str += DirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
	 c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];           

         str += indent+"[ "+c+"L";
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += ", "+c+"R";
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += " ] = FLA_Part_1x2( "+c;
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += ", ...\n";
         str += indent;
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "  ";
         str += "                             0, "; 
         str += DirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
         break;
     case '7': 
     case '8': 
	 c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];           

         str += indent+"[ "+c+"T, ...\n";
         str += indent+"  "+c+"B ] = FLA_Part_2x1( "+c+", ...\n";
         str += indent+"                       0, "; 
         str += DirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
         break;
     } 
  }
  return str;
}

function MRepartition( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i;
  var c, v, s, t, tpadding, spadding;
  var b="";

  if ( FnType != '0' ){  /* Determine Block Size */
    for (i=0; i<NumOpers; i++ ){
      if ( OperInfo[ i ][ 2 ] != '0' ) break;
    }
  
    if ( i == parseInt( NumOpers ) ){
      str = "No variable to split";   
      return str; 
    }
  
    c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
  
    str = indent+indent+"b = min( size( "+c;
  
    switch( OperInfo[ i ][ 2 ] ){
    case '1': str += "BR, 1 ), nb_alg );\n\n"
            break;
    case '2': str += "TL, 1 ), nb_alg );\n\n"
            break;
    case '3': str += "BL, 1 ), nb_alg );\n\n"
            break;
    case '4': str += "TR, 1 ), nb_alg );\n\n"
            break;
    case '5': str += "R";
            if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
            str += ", 2 ), nb_alg );\n\n"
            break;
    case '6': str += "L";
            if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
            str += ", 2 ), nb_alg );\n\n";
            break;
    case '7': str += "B, 1 ), nb_alg );\n\n"
            break;
    case '8': str += "T, 1 ), nb_alg );\n\n"
            break;
    }
  }

  for (i=0; i<NumOpers; i++ ){
     c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];

     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( FnType == '0' ){
            s = AllChoices[ 0 ][ OperInfo[ i ][ 0 ] ];
            v = AllChoices[ 1 ][ OperInfo[ i ][ 0 ] ];
            t = "t";
            tpadding = " ";
            b = "1";
          }
          else{
            s = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
            v = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
            t = "";
            tpadding = "";
            b = "b";
          }
          spadding = repeat( (s.length - 1), ' ' );

          if ( OperInfo[ i ][ 1 ] == '2' ){
             str += indent+indent+"[ "+c+"00, "+tpadding+v+"01, "+spadding+c+"02, "+tpadding+"...\n";
             str += indent+indent+"  "+v+"10"+t+", "+s+"11, "+v+"12"+t+", ...\n";
             str += indent+indent+"  "+c+"20, "+tpadding+v+"21, "+spadding+c+"22 ] ";
             str +=  "= FLA_Repart_2x2_to_3x3( "+c+"TL, "+c+"TR, ...\n";
             str += indent+indent+tpadding+spadding+"                                           "+c+"BL, "+c+"BR, ...\n";
             str += indent+indent+tpadding+spadding+"                                           "+b+", "+b+", ";
             str += DirChoicesAfter[ OperInfo[ i ][ 2 ] ]+" );\n\n";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
          if ( FnType == '0' ){
            v = AllChoices[ OperInfo[ i ][ 1 ]-1 ][ OperInfo[ i ][ 0 ] ];
            b = "1";
          }
          else{
            v = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
            b = "b";
          }
          if ( OperInfo[ i ][ 1 ] == '1' ){
            t = "t";
          }
          else{
            t = "" 
          }
          spadding = repeat( (v.length - 1), ' ' );

          if ( OperInfo[ i ][ 1 ] != '0' ){
             str += indent+indent+"[ "+c+"0"+t+", "+v+"1";
             if ( FnType != '0' )
               str += t;
             str += ", "+c+"2"+t+" ]";
             str +=  "= FLA_Repart_1x2_to_1x3( "+c+"L"+t+", "+c+"R"+t+", ...\n";
             str += indent+indent+spadding;
            if ( FnType != '0' )
               str += repeat( t.length, ' ' );
             str += repeat( t.length, ' ' )+repeat( t.length, ' ' )+
                   "                                     "+b+", ";
             str += DirChoicesAfter[ OperInfo[ i ][ 2 ] ]+" );\n\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     case '7': 
     case '8': 
          if ( FnType == '0' ){
            v = AllChoices[ OperInfo[ i ][ 1 ]-1 ][ OperInfo[ i ][ 0 ] ];
            b = "1";
            if ( OperInfo[ i ][ 1 ] == '2' ) t = "t";
            else t = "";
          }
          else{
            v = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
            b = "b";
            t = ""
          }
          tpadding = repeat( t.length, ' ' );

          if ( OperInfo[ i ][ 1 ] != '0' ){
             str += indent+indent+"[ "+c+"0"+", ...\n";
             str += indent+indent+"  "+v+"1"+t+", ...\n";
             str += indent+indent+"  "+c+"2"+" ] ";
             str +=  "= FLA_Repart_2x1_to_3x1( "+c+"T, ...\n";
             str += indent+indent+"                                "+c+"B, ...\n";
             str += indent+indent+"                                "+b+", ";
             str += DirChoicesAfter[ OperInfo[ i ][ 2 ] ]+" );\n\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
  }
  return str;
}



function MContinue( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i;
  var c, v, s, t, tpadding, spadding;
  var b="";

  for (i=0; i<NumOpers; i++ ){
     c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];

     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( FnType == '0' ){
            s = AllChoices[ 0 ][ OperInfo[ i ][ 0 ] ];
            v = AllChoices[ 1 ][ OperInfo[ i ][ 0 ] ];
            t = "t";
            tpadding = " ";
            b = "1";
          }
          else{
            s = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
            v = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
            t = "";
            tpadding = "";
            b = "b";
          }
          spadding = repeat( (s.length - 1), ' ' );

          str += indent+indent+"[ "+c+"TL, "+c+"TR, ...\n";
          str += indent+indent+"  "+c+"BL, "+c+"BR ] = ";
          str += "FLA_Cont_with_3x3_to_2x2( ";
          if ( OperInfo[ i ][ 1 ] == '2' ){
             str += c+"00, "+tpadding+v+"01, "+spadding+c+"02, "+tpadding+"...\n";
             str += indent+indent+"                                         ";
             str += v+"10"+t+", "+s+"11, "+v+"12"+t+", ...\n";
             str += indent+indent+"                                         ";
             str += c+"20, "+tpadding+v+"21, "+spadding+c+"22, ...\n";
             str += indent+indent+"                                         ";
             str += DirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
          if ( FnType == '0' ){
            v = AllChoices[ OperInfo[ i ][ 1 ]-1 ][ OperInfo[ i ][ 0 ] ];
            b = "1";
          }
          else{
            v = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
            b = "b";
          }

	  if ( OperInfo[ i ][ 1 ] == '1' )
            t = "t";
          else
            t = "" 

          if ( OperInfo[ i ][ 1 ] != '0' ){
             str += indent+indent+"[ "+c+"L"+t+", "+c+"R"+t+" ] = ";
             str += "FLA_Cont_with_1x3_to_1x2( ";
             str += c+"0"+t+", "+v+"1";
             if ( FnType != '0' )
               str += t;
             str += ", "+c+"2"+t+", ...\n";
             str += indent+indent+repeat( t.length, ' ')+repeat( t.length, ' ');
             if ( FnType != '0' )
               repeat( t.length, ' ' );
             str += "                                       ";
             str += DirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     case '7': 
     case '8': 
          if ( FnType == '0' ){
            v = AllChoices[ OperInfo[ i ][ 1 ]-1 ][ OperInfo[ i ][ 0 ] ];
            b = "1";
            if ( OperInfo[ i ][ 1 ] == '2' ) t = "t";
            else t = "";
          }
          else{
            v = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
            b = "b";
            t = ""
          }
          tpadding = repeat( t.length, ' ' );

          if ( OperInfo[ i ][ 1 ] != '0' ){
             str += indent+indent+"[ "+c+"T, ...\n";
             str += indent+"    "+c+"B ] = "; 
             str += "FLA_Cont_with_3x1_to_2x1( ";
             str += c+"0"+", ...\n";
             str += indent+indent+"                                   ";
             str += v+"1"+t+", ...\n";
             str += indent+indent+"                                   ";
             str += c+"2"+", ...\n ";
             str += indent+indent+"                                  ";
             str += DirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
  }
  return str;
}

function MFooter( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i;
  var c;

  str += indent + "end\n\n";

  for (i=0; i<NumOpers; i++ ){
     if ( OperInfo[ i ][ 3 ] != '0' ){
       switch( OperInfo[ i ][ 2 ] ){
       case '0': 
             c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];  
             str += indent+c+"_out = "+c+";\n";
             break;
       case '1':
       case '2':
       case '3':
       case '4':
            if ( OperInfo[ i ][ 1 ] == '2' ){
	       c = MChoices[ OperInfo[ i ][ 0 ] ];           

               str += indent+c+"_out = [ ";
               str += c+"TL, "+c+"TR\n";
               str += indent+"          "+c+"BL, "+c+"BR ];";
            }
            else{
               str += "Cannot split non-matrix into four quadrants\n"; 
               return str;
            }
            break;
     case '5': 
     case '6': 
	 c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];           

         str += indent+c;
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += "_out = [ "+c+"L";
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += ", "+c+"R";
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += " ];";
         break;
     case '7': 
     case '8': 
	 c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];           

         str += indent+c+"_out = [ ";
         str += c+"T\n";
         str += indent+"          "+c+"B ];";
         break;
     } 
     str += "\n\n";
    }
  }

  str += "return\n";

  return str;
}

function repeat( n, c ){
  var str = "";
  var i;

  for ( i=0; i<n; i++ )
    str += c;

  return str
} 
  