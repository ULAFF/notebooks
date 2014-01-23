function GenPscript( FnName, FnType, Variant, NumOpers, OperInfo, author, email ){
  var str="", notfirst=0, i;
  var curDate = new Date();

  str += "<html><pre><code>\n";
  /*
  str += "/* Copyright "+curDate.getFullYear();

  now = new Date
  for ( i=2004; i<now.getYear()+1; i++ )
    str += ", "+i;

  str += " The University of Texas at Austin  \n";

  str += " \n";
  str += "   For licensing information see\n";
  str += "                  http://www.cs.utexas.edu/users/flame/license.html \n";
  str += "\n";
  */
  str += "/*\n";
  str += "   Programmed by: "+author+"\n";
  str += "                  "+email+"\n";
  str += "*/\n\n";
  

  str += PHeader( FnName, FnType, Variant, NumOpers, OperInfo );

  str += PPartition( FnName, FnType, Variant, NumOpers, OperInfo );

  str += PGuard( FnName, FnType, Variant, NumOpers, OperInfo );

  str += PRepartition( FnName, FnType, Variant, NumOpers, OperInfo );

  str += indent+indent+"/*"+repeat( 60, '-' )+"*/\n\n";

  str += indent+indent+"/*"+repeat(22, ' ')+" update line 1 "+repeat(23,' ')+"*/\n";

  str += indent+indent+"/*"+repeat(22, ' ')+"       :       "+repeat(23,' ')+"*/\n";

  str += indent+indent+"/*"+repeat(22, ' ')+" update line n "+repeat(23,' ')+"*/\n\n";

  str += indent+indent+"/*"+repeat( 60, '-' )+"*/\n\n";

  str += PContinue( FnName, FnType, Variant, NumOpers, OperInfo );

  str += PFooter( FnName, FnType, Variant, NumOpers, OperInfo );

  str += "</code></pre></html>\n";

  with (parent.frames[1].document){
     open();
     writeln( str );
     close();
  }

  return false;
}

function PHeader( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i;
  var c, v, s, t, tpadding, spadding;
  var b="";
  var firsttime = 1;

  str = "#include \"PLA.h\"\n\n";

  str += "int "+FnName+"_"+BlkChoicesShort[ FnType ];
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
      str += "PLA_Obj "+AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];
      if ( OperInfo[ i ][ 1 ] == '1' && ( OperInfo[ i ][ 2 ] == '5' || OperInfo[ i ][ 2 ] == '6' ) )
         str += "t";
    } 
  }

  if ( FnType != '0' ) str += ", int nb_alg";

  str += " )\n";
  str += "{\n";

  for (i=0; i<NumOpers; i++ ){
     if ( OperInfo[ i ][ 1 ] == '0' ) continue;

     c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];

     if ( OperInfo[ i ][ 2 ] != '0' ) 
        str += indent+"PLA_Obj ";

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
             str +=                    c+"TL=NULL,   "+c+"TR=NULL,      ";
             str += c+"00=NULL, "+tpadding+v+"01=NULL, "+spadding+c+"02=NULL, \n";
             str +=  indent+"        "+c+"BL=NULL,   "+c+"BR=NULL,      ";
             str += v+"10"+t+"=NULL, "+s+"11=NULL, "+v+"12"+t+"=NULL,\n";
             str += indent+"                                   ";
             str += c+"20=NULL, "+tpadding+v+"21=NULL, "+spadding+c+"22=NULL;\n\n";
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
             str +=  c+"L"+t+"=NULL,    "+c+"R"+t+"=NULL,       ";
             str += c+"0"+t+"=NULL,  "+v+"1";
             if ( OperInfo[ i ][ 1 ] == '1' && FnType != '0' ) str += t;
             str += "=NULL,  "+c+"2"+t+"=NULL;\n\n";
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
             str +=                    c+"T=NULL,              ";
             str += c+"0=NULL,\n";
             str += indent+"        "+c+"B=NULL,              ";
             str += v+"1"+t+"=NULL,\n";
             str += indent+"                              ";
             str += c+"2=NULL;\n\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
  }

  str += indent + "PLA_Obj MINUS_ONE=NULL, ZERO=NULL, ONE=NULL;\n\n";
	
  if ( FnType != '0' ) str += indent+"int b;\n\n";

  str += indent + "PLA_Create_constants_conf_to( ";
  str += AllChoices[ OperInfo[ 0 ][ 1 ] ][ OperInfo[ 0 ][ 0 ] ];
  str += ", &amp;MINUS_ONE, &amp;ZERO, &amp;ONE );\n\n";
	
  return str;
}

function PGuard( FnName, FnType, Variant, NumOpers, OperInfo ){
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

  str = indent+"while ( ";

  switch( OperInfo[ i ][ 2 ] ){
  case '1': str += "PLA_Obj_length( "+c+"TL ) < PLA_Obj_length( "+c+" ) ){\n\n"; 
          break;
  case '2': str += "PLA_Obj_length( "+c+"BR ) < PLA_Obj_length( "+c+" ) ){\n\n"; 
          break;
  case '3': str += "PLA_Obj_length( "+c+"TR ) < PLA_Obj_length( "+c+" ) ){\n\n"; 
          break;
  case '4': str += "PLA_Obj_length( "+c+"BL ) < PLA_Obj_length( "+c+" ) ){\n\n"; 
          break;
  case '5': str += "PLA_Obj_width( "+c+"L";
          if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
          str += " ) < PLA_Obj_width( "+c;
          if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
          str += " ) ){\n\n"; 
          break;
  case '6': str += "PLA_Obj_width( "+c+"R";
          if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
          str += " ) < PLA_Obj_width( "+c;
          if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
          str += " ) ){\n\n"; 
          break;
  case '7': str += "PLA_Obj_length( "+c+"T ) < PLA_Obj_length( "+c+" ) ){\n\n"; 
          break;
  case '8': str += "PLA_Obj_length( "+c+"B ) < PLA_Obj_length( "+c+" ) ){\n\n"; 
          break;
  }

  return str;
}

function PPartition( FnName, FnType, Variant, NumOpers, OperInfo ){
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

             str += indent+"PLA_Part_2x2( "+c+",    ";
             str += "&amp;"+c+"TL, &amp;"+c+"TR,\n";
             str += indent+"                    &amp;"+c+"BL, &amp;"+c+"BR,";
             str += "     0, 0, "; 
             str += PDirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
	 c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];           

         str += indent+"PLA_Part_1x2( "+c;
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += ",    &amp;";
         str += c+"L";
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += ",  &amp;"+c+"R";
         if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
         str += ",      0, "; 
         str += PDirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
         break;
     case '7': 
     case '8': 
	 c = AllChoices[ OperInfo[ i ][ 1 ] ][ OperInfo[ i ][ 0 ] ];           

         str += indent+"PLA_Part_2x1( "+c+",    &amp;";
         str += c+"T, \n";
         str += indent+"                    &amp;"+c+"B,            ";
         str += "0, "; 
         str += PDirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
         break;
     } 
  }
  return str;
}

function PRepartition( FnName, FnType, Variant, NumOpers, OperInfo ){
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
  
    str += indent+indent;

    switch( OperInfo[ i ][ 2 ] ){
    case '1': str += "b = min( PLA_Obj_length( "+c+"BR ), nb_alg );\n\n"
            break;
    case '2': str += "b = min( PLA_Obj_length( "+c+"TL ), nb_alg );\n\n"
            break;
    case '3': str += "b = min( PLA_Obj_length( "+c+"BL ), nb_alg );\n\n"
            break;
    case '4': str += "b = min( PLA_Obj_length( "+c+"TR ), nb_alg );\n\n"
            break;
    case '5': str += "b = min( PLA_Obj_width( "+c+"R";
            if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
            str += " ), nb_alg );\n\n"
            break;
    case '6': str += "b = min( PLA_Obj_width( "+c+"L";
            if ( OperInfo[ i ][ 1 ] == '1' ) str += "t";
            str += " ), nb_alg );\n\n";
            break;
    case '7': str += "b = min( PLA_Obj_length( "+c+"B ), nb_alg );\n\n"
            break;
    case '8': str += "b = min( PLA_Obj_length( "+c+"T ), nb_alg );\n\n"
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
             str += indent+indent+"PLA_Repart_2x2_to_3x3( "+c+"TL, /**/ "+c+"TR,       &amp;";
             str += c+"00, "+tpadding;
             if ( OperInfo[ i ][ 2 ] == '1' || OperInfo[ i ][ 2 ] == '4' ) 
               str += "/**/ ";
             str += "&amp;"+v+"01, "+spadding;
             if ( OperInfo[ i ][ 2 ] == '2' || OperInfo[ i ][ 2 ] == '3' ) 
               str += "/**/ ";
             str += "&amp;"+c+"02,\n";
             if ( OperInfo[ i ][ 2 ] == '1' || OperInfo[ i ][ 2 ] == '3' ){
                str += indent+indent+"                    /* ************* */";
                str += "   /* "+repeat( t.length+t.length+s.length+19, '*' );
                str += " */\n";
             }
             str += indent+indent+"                                            &amp;"+
                    v+"10"+t+", ";
             if ( OperInfo[ i ][ 2 ] == '1' || OperInfo[ i ][ 2 ] == '4' ) 
               str += "/**/ ";
             str += "&amp;"+s+"11, ";
             if ( OperInfo[ i ][ 2 ] == '2' || OperInfo[ i ][ 2 ] == '3' ) 
               str += "/**/ ";
             str += "&amp;"+v+"12"+t+",\n";
             if ( OperInfo[ i ][ 2 ] == '2' || OperInfo[ i ][ 2 ] == '4' ){
                str += indent+indent+"                    /* ************* */";
                str += "   /* "+repeat( t.length+t.length+s.length+19, '*' );
                str += " */\n";
             }
             str += indent+indent+"                       "+
                    c+"BL, /**/ "+c+"BR, ";
             str += "      ";
             str += "&amp;"+c+"20, "+tpadding;
             if ( OperInfo[ i ][ 2 ] == '1' || OperInfo[ i ][ 2 ] == '4' ) 
               str += "/**/ ";
             str += "&amp;"+v+"21, "+spadding;
             if ( OperInfo[ i ][ 2 ] == '2' || OperInfo[ i ][ 2 ] == '3' ) 
               str += "/**/ ";
             str += "&amp;"+c+"22,\n";
             str += indent+indent+"                       "+b+", "+b+", ";
             str += PDirChoicesAfter[ OperInfo[ i ][ 2 ] ]+" );\n\n";
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
             str +=  indent+indent+"PLA_Repart_1x2_to_1x3( "+c+"L"+t+",  /**/ "+c+"R"+t+",   ";
             str += "     &amp;"+c+"0"+t+", "
             if ( OperInfo[ i ][ 2 ] == '5' )
               str += "/**/ ";
             str += "&amp;"+v+"1";
             if ( FnType != '0' )
               str += t;
             str += ", ";
             if ( OperInfo[ i ][ 2 ] == '6' )
               str += "/**/ ";
             str += "&amp;"+c+"2"+t+",\n";
             str += indent+indent+"                       "+b+", ";
             str += PDirChoicesAfter[ OperInfo[ i ][ 2 ] ]+" );\n\n";
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
             str += indent+indent+"PLA_Repart_2x1_to_3x1( "+c+"T,     ";
             str += "           &amp;"+c+"0"+", \n";
             if ( OperInfo[ i ][ 2 ] == '7' ){
                str += indent+indent+"                    /* ** */";
                str += "            /* "+repeat( t.length+v.length+1, '*' );
                str += " */\n";
             }
             str += indent+indent+"                                          &amp;"+
                    v+"1"+t+", \n";
             if ( OperInfo[ i ][ 2 ] == '8' ){
                str += indent+indent+"                    /* ** */";
                str += "            /* "+repeat( t.length+v.length+1, '*' );
                str += " */\n";
             }
             str += indent+indent+"                       "+c+"B,     ";
             str += "           &amp;"+c+"2"+",     ";
             str += "   "+b+", ";
             str += PDirChoicesAfter[ OperInfo[ i ][ 2 ] ]+" );\n\n";
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



function PContinue( FnName, FnType, Variant, NumOpers, OperInfo ){
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

          if ( OperInfo[ i ][ 1 ] == '2' ){
             str += indent+indent+"PLA_Cont_with_3x3_to_2x2( &amp;"+c+"TL, /**/ &amp;"+c+"TR,       ";
             str += c+"00, "+tpadding;
             if ( OperInfo[ i ][ 2 ] == '2' || OperInfo[ i ][ 2 ] == '3' ) 
               str += "/**/ ";
             str += ""+v+"01, "+spadding;
             if ( OperInfo[ i ][ 2 ] == '1' || OperInfo[ i ][ 2 ] == '4' ) 
               str += "/**/ ";
             str += ""+c+"02,\n";
             if ( OperInfo[ i ][ 2 ] == '2' || OperInfo[ i ][ 2 ] == '4' ){
                str += indent+indent+"                        /* ************** */";
                str += "  /* "+repeat( t.length+t.length+s.length+17, '*' );
                str += " */\n";
             }
             str += indent+indent+"                                                 "+
                    v+"10"+t+", ";
             if ( OperInfo[ i ][ 2 ] == '2' || OperInfo[ i ][ 2 ] == '3' ) 
               str += "/**/ ";
             str += ""+s+"11, ";
             if ( OperInfo[ i ][ 2 ] == '1' || OperInfo[ i ][ 2 ] == '4' ) 
               str += "/**/ ";
             str += ""+v+"12"+t+",\n";
             if ( OperInfo[ i ][ 2 ] == '1' || OperInfo[ i ][ 2 ] == '3' ){
                str += indent+indent+"                        /* ************** */";
                str += "  /* "+repeat( t.length+t.length+s.length+17, '*' );
                str += " */\n";
             }
             str += indent+indent+"                          &amp;"+
                    c+"BL, /**/ &amp;"+c+"BR, ";
             str += "      ";
             str += ""+c+"20, "+tpadding;
             if ( OperInfo[ i ][ 2 ] == '2' || OperInfo[ i ][ 2 ] == '3' ) 
               str += "/**/ ";
             str += ""+v+"21, "+spadding;
             if ( OperInfo[ i ][ 2 ] == '1' || OperInfo[ i ][ 2 ] == '4' ) 
               str += "/**/ ";
             str += ""+c+"22,\n";
             str += indent+indent+"                          ";
             str += PDirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
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
             str +=  indent+indent+"PLA_Cont_with_1x3_to_1x2( &amp;"+c+"L"+t+",  /**/ &amp;"+c+"R"+t+",   ";
             str += "     "+c+"0"+t+", "
             if ( OperInfo[ i ][ 2 ] == '6' )
               str += "/**/ ";
             str += ""+v+"1";
             if ( FnType != '0' )
               str += t;
             str += ", ";
             if ( OperInfo[ i ][ 2 ] == '5' )
               str += "/**/ ";
             str += ""+c+"2"+t+",\n";
             str += indent+indent+"                          ";
             str += PDirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
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
             str += indent+indent+"PLA_Cont_with_3x1_to_2x1( &amp;"+c+"T,     ";
             str += "           "+c+"0"+", \n";
             if ( OperInfo[ i ][ 2 ] == '8' ){
                str += indent+indent+"                        /* ** */";
                str += "           /* "+repeat( t.length+v.length+1, '*' );
                str += " */\n";
             }
             str += indent+indent+"                                              "+
                    v+"1"+t+", \n";
             if ( OperInfo[ i ][ 2 ] == '7' ){
                str += indent+indent+"                        /* ** */";
                str += "           /* "+repeat( t.length+v.length+1, '*' );
                str += " */\n";
             }
             str += indent+indent+"                          &amp;"+c+"B,     ";
             str += "           "+c+"2"+",     ";
             str += PDirChoicesBefore[ OperInfo[ i ][ 2 ] ]+" );\n\n";
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

function PFooter( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i;
  var c;

  str += indent + "}\n\n";

  for (i=0; i<NumOpers; i++ ){
     if ( OperInfo[ i ][ 1 ] == '0' ) continue;

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
             str += indent+"PLA_Obj_free( &amp;"+c+"TL ); PLA_Obj_free( &amp;"+c+"TR );\n";
             str += indent+"PLA_Obj_free( &amp;"+c+"BL ); PLA_Obj_free( &amp;"+c+"BR );\n";
             str += indent+"PLA_Obj_free( &amp;"+c+"00 ); "+tpadding;
             str += "PLA_Obj_free( &amp;"+v+"01 ); "+spadding;
             str += "PLA_Obj_free( &amp;"+c+"02 );\n";
             str += indent+"PLA_Obj_free( &amp;"+v+"10"+t+" ); ";
             str += "PLA_Obj_free( &amp;"+s+"11 ); ";
             str += "PLA_Obj_free( &amp;"+v+"12"+t+" );\n";
             str += indent+"PLA_Obj_free( &amp;"+c+"20 ); "+tpadding;
             str += "PLA_Obj_free( &amp;"+v+"21 ); "+spadding;
             str += "PLA_Obj_free( &amp;"+c+"22 );\n\n";
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
             str +=  indent+"PLA_Obj_free( &amp;"+c+"L"+t+" ); PLA_Obj_free( &amp;"+c+"R"+t+" );\n";
             str +=  indent+"PLA_Obj_free( &amp;"+c+"0"+t+" ); ";
             str +=  "PLA_Obj_free( &amp;"+v+"1";
             if ( OperInfo[ i ][ 1 ] == '1' && FnType != '0' ) str += t;
             str += " ); ";
             str += "PLA_Obj_free( &amp;"+c+"2"+t+" );\n\n";
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
             str += indent+"PLA_Obj_free( &amp;"+c+"T ); ";
             str += "PLA_Obj_free( &amp;"+c+"B );\n";
             str += indent+"PLA_Obj_free( &amp;"+c+"0 ); ";
             str += "PLA_Obj_free( &amp;"+v+"1"+t+" ); ";
             str += "PLA_Obj_free( &amp;"+c+"2 );\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
  }

  str += indent + "PLA_Obj_free( &amp;MINUS_ONE );";
  str += " PLA_Obj_free( &amp;ZERO ); ";
  str += "PLA_Obj_free( &amp;ONE );\n\n";

  str += indent + "return PLA_SUCCESS;\n";
  str += "}\n\n";

  return str;
}

function repeat( n, c ){
  var str = "";
  var i;

  for ( i=0; i<n; i++ )
    str += c;

  return str
} 
  