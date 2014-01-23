function GenWscript( FnName, FnType, Variant, NumOpers, OperInfo, author, email ){
  var str="", notfirst=0, i;

  FnName = FnName.replace( /([^\\])\_/gi,"$1\\_");

  str += "<html><pre><code>\n";

  str += LWHeader( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LInvariant( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LGuard( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LPartition( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LRepartition( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LContinue( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LAfterRepartition( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LBeforeContinue( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LUpdate( FnName, FnType, Variant, NumOpers, OperInfo );

  str += "\n\n</code></pre></html>";

  with (parent.frames[1].document){
     open();
     writeln( str );
     close();
  }

  return false;
}

function GenAscript( FnName, FnType, Variant, NumOpers, OperInfo, author, email ){
  var str="", notfirst=0, i;

  FnName = FnName.replace( /([^\\])\_/gi,"$1\\_");

  str += "<html><pre><code>\n";

  str += LAHeader( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LGuard( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LPartition_Alg( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LRepartition_Alg( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LContinue_Alg( FnName, FnType, Variant, NumOpers, OperInfo );

  str += LUpdate( FnName, FnType, Variant, NumOpers, OperInfo );

  str += "\n\n</code></pre></html>";

  with (parent.frames[1].document){
     open();
     writeln( str );
     close();
  }

  return false;
}

function LWHeader( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="", c="";
  var i;
  var firsttime = 1;

  str += "\\resetsteps      % Reset all the commands to create a blank worksheet  \n"
  str += "\n"

  str += "% Define the operation to be computed\n\n" 
  str += "\\renewcommand{\\operation}{ \\left[ ";

  for ( i=0; i<NumOpers; i++ ){
    c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
//    if ( OperInfo[ i ][ OPERAND_TYPE ] == '0' ) c = "\\"+c;

    if ( OperInfo[ i ][ OPERAND_IO ] == IO_INOUT ){
      if ( firsttime == 0 )
         str += ", ";
      else
         firsttime = 0;
      str += c;
      if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' && ( OperInfo[ i ][ OPERAND_DIR  ] == '5' || OperInfo[ i ][ OPERAND_DIR ] == '6' ) )
         str += "^T";
      str += "";
    } 
  }

  str += " \\right] := ";
  
  str += "\\mbox{\\sc "+FnName.replace(/\s+/g,"\\_")+"\\_"+BLK[ FnType ];
  
  if (Variant != "0"){
      str += "\\_var"+Variant;
  } 
  
  str += "}";

  str += "( ";

  firsttime = 1;

  for ( i=0; i<NumOpers; i++ ){
    c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
//    if ( OperInfo[ i ][ OPERAND_TYPE ] == '0' ) c = "\\"+c;

    if ( OperInfo[ i ][ OPERAND_IO ] != IO_TMP ){
      if ( firsttime == 0 )
         str += ", ";
      else
         firsttime = 0;
      
      str += c;

      if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' && ( OperInfo[ i ][ OPERAND_DIR ] == '5' || OperInfo[ i ][ OPERAND_DIR ] == '6' ) )
         str += "^T";
    } 
  }

  str += " ) }\n\n";

  str += "\\renewcommand{\\routinename}{\\operation}\n\n";

  str += "% Step 1a: Precondition \n\n" 

  str += "\\renewcommand{\\precondition}{\n"

  firsttime = 1; 
  for ( i=0; i<NumOpers; i++ ){
    if ( OperInfo[ i ][ 3 ] == '2' ){

      str += indent
      c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
//      if ( OperInfo[ i ][ OPERAND_TYPE ] == '0' ) c = "\\"+c;
      if ( firsttime == 0 )
         str +=  "\\wedge\n"+indent;
      else
         firsttime = 0;
      str += c;
      if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' && ( OperInfo[ i ][ OPERAND_DIR ] == '5' || OperInfo[ i ][ OPERAND_DIR ] == '6' ) )
         str += "^T";
      str += " = "
      str += "\\widehat{"+c+"}";
      if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' && ( OperInfo[ i ][ OPERAND_DIR ] == '5' || OperInfo[ i ][ OPERAND_DIR ] == '6' ) )
         str += "^T";
      str += "\n"
    } 
  }

  str +="}\n\n"

  str += "% Step 1b: Postcondition \n\n" 

  str += "\\renewcommand{\\postcondition}{ \n  \\left[";

  firsttime=1

  for ( i=0; i<NumOpers; i++ ){
    c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
//    if ( OperInfo[ i ][ OPERAND_TYPE ] == '0' ) c = "\\"+c;

    if ( OperInfo[ i ][ OPERAND_IO ] == IO_INOUT ){
      if ( firsttime == 0 )
         str += ", ";
      else
         firsttime = 0;
      str += c;
      if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_VECTOR && ( OperInfo[ i ][ OPERAND_DIR ] == '5' || OperInfo[ i ][ OPERAND_DIR ] == '6' ) )
         str += "^T";
      str += "";
    } 
  }
  str += " \\right]\n  =\n  ";
  
  str += "\\mbox{"+FnName+"}"
  str += "( ";

  firsttime = 1;

  for ( i=0; i<NumOpers; i++ ){
    c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
//    if ( OperInfo[ i ][ OPERAND_TYPE ] == '0' ) c = "\\"+c;

    if ( OperInfo[ i ][ OPERAND_IO ] != IO_TMP ){
      if ( firsttime == 0 )
         str += ", ";
      else
         firsttime = 0;
      if ( OperInfo[ i ][ OPERAND_IO ] == IO_INOUT )
        str += "\\widehat{"
      str += c;
      if ( OperInfo[ i ][ OPERAND_IO ] == IO_INOUT )
        str += "}"
      if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_VECTOR && ( OperInfo[ i ][ OPERAND_DIR ] == '5' || OperInfo[ i ][ OPERAND_DIR ] == '6' ) )
         str += "^T";
    } 
  }

  str += " )\n}\n\n";

  return str;
}


function LAHeader( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="", c="";
  var i;
  var firsttime = 1;

  str += "\\resetsteps      % Reset all the commands to create a blank worksheet  \n"
  str += "\n"

  str += "% Define the operation to be computed\n\n" 
  str += "\\renewcommand{\\routinename}{ \\left[ ";

  for ( i=0; i<NumOpers; i++ ){
    c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
//    if ( OperInfo[ i ][ OPERAND_TYPE ] == '0' ) c = "\\"+c;

    if ( OperInfo[ i ][ OPERAND_IO ] == IO_INOUT ){
      if ( firsttime == 0 )
         str += ", ";
      else
         firsttime = 0;
      str += c;
      if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_VECTOR && ( OperInfo[ i ][ OPERAND_DIR ] == '5' || OperInfo[ i ][ OPERAND_DIR ] == '6' ) )
         str += "^T";
      str += "";
    } 
  }

  str += " \\right] := ";
  
  //  str += "\\mbox{\\sc "+FnName+"\\_"+BLK[ FnType ]+"}"

  str += "\\mbox{\\sc "+FnName.replace(/\s+/g,"\\_")+"\\_"+BLK[ FnType ];
  
  if (Variant != "0"){
      str += "\\_var"+Variant;
  } 
  
  str += "}";

  str += "( ";

  firsttime = 1;

  for ( i=0; i<NumOpers; i++ ){
    c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
//    if ( OperInfo[ i ][ OPERAND_TYPE ] == '0' ) c = "\\"+c;

    if ( OperInfo[ i ][ OPERAND_IO ] != IO_TMP ){
      if ( firsttime == 0 )
         str += ", ";
      else
         firsttime = 0;


      str += c;

      if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_VECTOR && ( OperInfo[ i ][ OPERAND_DIR ] == '5' || OperInfo[ i ][ OPERAND_DIR ] == '6' ) )
         str += "^T";
    } 
  }

  str += " ) }\n\n";

  return str;
}

function LInvariant( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i;
  var firsttime = 1;
  var c="";

  str += "% Step 2: Invariant \n" 
  str += "% Note: Right-hand side of equalities must be updated appropriately\n\n" 

  str += "\\renewcommand{\\invariant}{\n";

  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ OPERAND_IO ] == IO_INOUT ){
     if ( firsttime == 0 )
        str += "\\wedge\n"
     else
        firsttime = 0
     switch( OperInfo[ i ][ OPERAND_DIR ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_MATRIX ){
	     c = MChoices[ OperInfo[ i ][ OPERAND_NAME ] ];           

             str += indent+"\\FlaTwoByTwo{"+c+"_{TL}}{"+c+"_{TR}}\n";
             str += indent+"             {"+c+"_{BL}}{"+c+"_{BR}} =\n";
             str += indent+"\\FlaTwoByTwo{\\widehat{"+c+"}_{TL}}{\\widehat{"+c+"}_{TR}}\n";
             str += indent+"             {\\widehat{"+c+"}_{BL}}{\\widehat{"+c+"}_{BR}}\n";

          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
	 c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];           

         str += indent+"\\FlaOneByTwo{"+c+"_L";
         if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_VECTOR ) str += "^T";
         str += "}{"+c+"_R";
         if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_VECTOR ) str += "^T";
         str += "}  = \n";
         str += indent+"\\FlaOneByTwo{\\widehat{"+c+"}_L";
         if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_VECTOR ) str += "^T";
         str += "}{\\widehat{"+c+"}_R";
         if ( OperInfo[ i ][ OPERAND_TYPE ] == TYPE_VECTOR ) str += "^T";
         str += "} \n";
         break;
     case '7': 
     case '8': 
	 c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];           

         str += indent+"\\FlaTwoByOne{"+c+"_T}\n";
         str += indent+"            {"+c+"_B} = \n"
         str += indent+"\\FlaTwoByOne{\\widehat{"+c+"}_T}\n";
         str += indent+"            {\\widehat{"+c+"}_B}\n"
         break;
     } 
   }
  }

  str += "}\n\n"
  return str
}

function LGuard( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str = "";
  var i; 

  str += "% Step 3: Loop-guard \n\n" 

  for (i=0; i<NumOpers; i++ ){
    if ( OperInfo[ i ][ 2 ] != '0' ) break;
  }

  if ( i == parseInt( NumOpers ) ){
    str += "No variable to split";   
    return str; 
  }

  c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];

  str += "\\renewcommand{\\guard}{\n"+indent

  switch( OperInfo[ i ][ 2 ] ){
  case '1': str += "m( "+c+"_{TL} ) < m( "+c+" )\n"; 
          break;
  case '2': str += "m( "+c+"_{BR} ) < m( "+c+" )\n"; 
          break;
  case '3': str += "m( "+c+"_{TR} ) < m( "+c+" )\n"; 
          break;
  case '4': str += "m( "+c+"_{BL} ) < m( "+c+" )\n"; 
          break;
  case '5': str += "n( "+c+"_L";
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) str += "^T";
          str += " ) < n( "+c;
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) str += "^T";
          str += " )\n"; 
          break;
  case '6': str += "n( "+c+"_R";
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) str += "^T";
          str += " ) < n( "+c;
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) str += "^T";
          str += " )\n"; 
          break;
  case '7': str += "m( "+c+"_T ) < m( "+c+" )\n"; 
          break;
  case '8': str += "m( "+c+"_B ) < m( "+c+" )\n"; 
          break;
  }

  str += "}\n\n"

  return str;
}

function LPartition( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var whle="";
  var i,j;
  var c;
  var firsttime=1;
  var countperline=0;

  str += "% Step 4: Initialize \n\n" 

  str += "\\renewcommand{\\partitionings}{\n"
  whle += "\\renewcommand{\\partitionsizes}{\n"

  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ 2 ] == '0' ) continue

   for (j=0; j<1; j++ ){
/* Second time throught the "\nhat" version is generated */
   
     c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];           
     if ( j == 1 ){
       if ( OperInfo[ i ][ 3 ] != '2' ) continue
       c = "\\widehat{"+c+"}"
     }  

     if ( firsttime == 0 ){
        str += ",\n";
        whle += ",\n" 
     }
     else
        firsttime = 0

	    //     countperline++;
     /*     if ( countperline > 2 ){
       str += "\\\\ \n";
       countperline = 0;
     }
     */

     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ){
             str += indent+"$\n"+indent;
             str += c+" \\rightarrow\n";
             str += indent+"\\FlaTwoByTwo{"+c+"_{TL}}{"+c+"_{TR}}\n";
             str += indent+"            {"+c+"_{BL}}{"+c+"_{BR}}\n";
             str += indent+"$\n";   
             whle += "$ "+c+"_{"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ]+"} $ is "
             whle += "$ 0 \\times 0 $" 
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
             str += indent+"$\n"+indent;
             str += c+" \\rightarrow\n";
             str += indent+"\\FlaOneByTwo{"
             str += c+"_L"
             if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) str += "^T";
             str += "}{"
             str += c+"_R"
             if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) str += "^T";
             str += "}\n";
             str += indent+"$\n";   
             whle += "$ "+c+"_"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ]
             if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) whle += "^T";
             whle += " $ has "
             whle += "$ 0 $ columns" 
             break;
     case '7': 
     case '8': 
             str += indent+"$\n"+indent;
             str += c+" \\rightarrow\n";
             str += indent+"\\FlaTwoByOne{"+c+"_{T}}\n";
             str += indent+"            {"+c+"_{B}}\n";
             str += indent+"$\n";   
             whle += "$ "+c+"_"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ]+" $ has "
             whle += "$ 0 $ rows" 
             break;
     } 
   }
  }

  str += "}\n\n"
  whle += "\n}\n\n"

  str = str+whle

  return str;
}

function LPartition_Alg( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var whle="";
  var i,j;
  var c;
  var firsttime=1;
  var countperline=0;

  str += "% Step 4: Define Initialize \n\n" 

  str += "\\renewcommand{\\partitionings}{\n"
  whle += "\\renewcommand{\\partitionsizes}{\n"

  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ 2 ] == '0' ) continue

   for (j=0; j<1; j++ ){
/* Second time throught the "\nhat" version is generated 
Note that this never happens now.  */
   
     c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];           
     if ( j == 1 ){
       if ( OperInfo[ i ][ 3 ] != '2' ) continue
       c = "\\widehat{"+c+"}"
     }  

     if ( firsttime == 0 ){
        str += ",\n";
        whle += ",\n" 
     }
     else
        firsttime = 0

	    //     countperline++;
     /*     if ( countperline > 2 ){
       str += "\\\\ \n";
       countperline = 0;
     }
     */

     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ){
             str += indent+"$\n"+indent;
             str += c+" \\rightarrow\n";
             str += indent+"\\FlaTwoByTwo{"+c+"_{TL}}{"+c+"_{TR}}\n";
             str += indent+"            {"+c+"_{BL}}{"+c+"_{BR}}\n";
             str += indent+"$\n";   
             whle += "$ "+c+"_{"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ]+"} $ is "
             whle += "$ 0 \\times 0 $" 
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
             str += indent+"$\n"+indent;
             str += c+" \\rightarrow\n";
             str += indent+"\\FlaOneByTwo{"
             str += c+"_L"
             if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) str += "^T";
             str += "}{"
             str += c+"_R"
             if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) str += "^T";
             str += "}\n";
             str += indent+"$\n";   
             whle += "$ "+c+"_"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ]
             if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ) whle += "^T";
             whle += " $ has "
             whle += "$ 0 $ columns" 
             break;
     case '7': 
     case '8': 
             str += indent+"$\n"+indent;
             str += c+" \\rightarrow\n";
             str += indent+"\\FlaTwoByOne{"+c+"_{T}}\n";
             str += indent+"            {"+c+"_{B}}\n";
             str += indent+"$\n";   
             whle += "$ "+c+"_{"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ]+"} $ has "
             whle += "$ 0 $ rows" 
             break;
     } 
   }
  }

  str += "}\n\n"
  whle += "\n}\n\n"

  str = str+whle

  return str;
}

function LRepartition( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i, j;
  var c, v, s, t, tpadding, spadding;
  var b="", whre="";
  var firsttime=1, countperline=0;

  str += "% Step 5a: Repartition the operands \n\n" 

  if ( FnType != '0' ){  /* Determine Block Size */
    str += "\\renewcommand{\\blocksize}{b}\n\n"
    b = "b"
  }

  str += "\\renewcommand{\\repartitionings}{\n"
  whre += "\\renewcommand{\\repartitionsizes}{\n"
  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ 2 ] == '0' ) continue
 
   for ( j=0; j<1; j++ ){
 
     c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
     if ( j == 1 ){
       if ( OperInfo[ i ][ 3 ] == '2' )
         c = "\\widehat{"+c+"}"
       else
         continue
     }

     if ( firsttime == 0 ){
       str +=",\n"
        whre += ",\n" 
     }
     else
       firsttime = 0;

     //     countperline++
	 /*;
     if ( countperline > 2 ){
       str += "\\\\ \n";
       countperline = 0;
     }
	 

     str += "$\n";
	 */
     str += "$";
     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( FnType == '0' ){
            s = LAllChoices[ 0 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ 1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "^T";
            b = "1";
          }
          else{
            s = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "";
            b = "b";
          }
          if ( j == 1 ){
            if ( OperInfo[ i ][ 3 ] == '2' )
              s = "\\widehat{"+s+"}"
              v = "\\widehat{"+v+"}"
          }

          if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ){
             str +=  indent+"\\FlaTwoByTwo{"+c+"_{TL}}{"+c+"_{TR}}\n";
             str +=  indent+"            {"+c+"_{BL}}{"+c+"_{BR}}\n";
             str +=  indent+"\\rightarrow\n";
             str +=  indent+"\\FlaThreeByThree"+
                     DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str +=  "{"+c+"_{00}}{"+v+"_{01}}{"+c+"_{02}}\n";
             str +=  indent+"                  ";  
             str +=  "{"+v+"_{10}"+t+"}{"+s+"_{11}}{"+v+"_{12}"+t+"}\n";
             str +=  indent+"                  ";  
             str +=  "{"+c+"_{20}}{"+v+"_{21}}{"+c+"_{22}}\n$";
             whre += indent+"$ "+s+"_{11} $ is $ "+b+" \\times "+b+" $";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
          }
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ){
            t = "^T";
          }
          else{
            t = "" 
          }
          if ( j == 1 )
            v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaOneByTwo{"+c+"_L"+t+"}{"+c+"_R"+t+"}\n";
             str += "\\rightarrow";
             str += indent+"\\FlaOneByThree";
             str += DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0"+t+"}{"+v+"_1";
             if ( FnType != '0' )
               str += t;
             str += "}{"+c+"_2"+t+"}\n$\n";
             whre += "$ "+v+"_1";
             if ( FnType != '0' )
               whre += t;
             whre += " $ has $ "+b+" $ column";
             if ( b == 'b' ) whre += "s"; 
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     case '7': 
     case '8': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
            if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ) t = "^T";
            else t = "";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
            t = ""
          }
          tpadding = repeat( t.length, ' ' );

          if ( j == 1 )
             v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaTwoByOne{ "+c+"_T }\n";
             str += indent+"             { "+c+"_B }\n";
             str += "\\rightarrow\n";
             str += indent+"\\FlaThreeByOne";
             str += DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0}\n";
             str += indent+"               ";
             str += "{"+v+"_1"+t+"}\n";
             str += indent+"               ";
             str += "{"+c+"_2}\n$\n";
             whre += "$ "+v+"_1 $ has $ "+b+" $ row";
             if ( b == 'b' ) whre += "s";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
   }
  }
  str = str+"}\n\n"+whre+"}\n\n";

  return str;
}

function LRepartition_Alg( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i, j;
  var c, v, s, t, tpadding, spadding;
  var b="", whre="";
  var firsttime=1, countperline=0;

  str += "% Step 5a: Repartition the operands \n\n" 

  if ( FnType != '0' ){  /* Determine Block Size */
    str += "\\renewcommand{\\blocksize}{b}\n\n"
    b = "b"
  }

  str += "\\renewcommand{\\repartitionings}{\n"
  whre += "\\renewcommand{\\repartitionsizes}{\n"
  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ 2 ] == '0' ) continue
 
   for ( j=0; j<1; j++ ){
 
     c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
     if ( j == 1 ){
       if ( OperInfo[ i ][ 3 ] == '2' )
         c = "\\widehat{"+c+"}"
       else
         continue
     }

     if ( firsttime == 0 ){
       str +=",\n"
        whre += ",\n" 
     }
     else
       firsttime = 0;

     //     countperline++;
     /*     if ( countperline > 2 ){
       str += "\\\\ \n";
       countperline = 0;
     }
     

     str += "$\n";
     */
     str += "$";
     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( FnType == '0' ){
            s = LAllChoices[ 0 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ 1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "^T";
            b = "1";
          }
          else{
            s = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "";
            b = "b";
          }
          if ( j == 1 ){
            if ( OperInfo[ i ][ 3 ] == '2' )
              s = "\\widehat{"+s+"}"
              v = "\\widehat{"+v+"}"
          }

          if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ){
             str +=  indent+"\\FlaTwoByTwo{"+c+"_{TL}}{"+c+"_{TR}}\n";
             str +=  indent+"            {"+c+"_{BL}}{"+c+"_{BR}}\n";
             str +=  indent+"\\rightarrow\n";
             str +=  indent+"\\FlaThreeByThree"+
                     DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str +=  "{"+c+"_{00}}{"+v+"_{01}}{"+c+"_{02}}\n";
             str +=  indent+"                  ";  
             str +=  "{"+v+"_{10}"+t+"}{"+s+"_{11}}{"+v+"_{12}"+t+"}\n";
             str +=  indent+"                  ";  
             str +=  "{"+c+"_{20}}{"+v+"_{21}}{"+c+"_{22}}\n$";
             whre += indent+"$ "+s+"_{11} $ is $ "+b+" \\times "+b+" $";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
          }
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ){
            t = "^T";
          }
          else{
            t = "" 
          }
          if ( j == 1 )
            v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaOneByTwo{"+c+"_L"+t+"}{"+c+"_R"+t+"}\n";
             str += "\\rightarrow";
             str += indent+"\\FlaOneByThree";
             str += DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0"+t+"}{"+v+"_1";
             if ( FnType != '0' )
               str += t;
             str += "}{"+c+"_2"+t+"}\n$\n";
             whre += indent+"$ "+v+"_1";
             if ( FnType != '0' )
               whre += t;
             whre += " $ has $"+b+"$ column";
             if ( b == 'b' ) whre += "s"; 
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     case '7': 
     case '8': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
            if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ) t = "^T";
            else t = "";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
            t = ""
          }
          tpadding = repeat( t.length, ' ' );

          if ( j == 1 )
             v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaTwoByOne{ "+c+"_T }\n";
             str += indent+"            { "+c+"_B }\n";
             str += "\\rightarrow\n";
             str += indent+"\\FlaThreeByOne";
             str += DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0}\n";
             str += indent+"               ";
             str += "{"+v+"_1"+t+"}\n";
             str += indent+"               ";
             str += "{"+c+"_2}\n$\n";
             whre += indent+"$ "+v+"_1 $ has $ "+b+" $ row";
             if ( b == 'b' ) whre += "s";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
   }
  }
  str = str+"}\n\n"+whre+"}\n\n";

  return str;
}

function LContinue( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i, j;
  var c, v, s, t, tpadding, spadding;
  var b="";
  var firsttime=1, countperline=0;

  str += "% Step 5b: Move the double lines \n\n" 

  str += "\\renewcommand{\\moveboundaries}{\n"

  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ 2 ] == '0' ) continue
 
   for ( j=0; j<1; j++ ){
 
     c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
     if ( j == 1 ){
       if ( OperInfo[ i ][ 3 ] == '2' )
         c = "\\widehat{"+c+"}"
       else
         continue
     }

     if ( firsttime == 0 ){
       str +=",\n"
     }
     else
       firsttime = 0;

     //     countperline++;
     /*     if ( countperline > 2 ){
       str += "\\\\ \n";
       countperline = 0;
     }
     

     str += "$\n";
     */
     str += "$";
     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( FnType == '0' ){
            s = LAllChoices[ 0 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ 1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "^T";
            b = "1";
          }
          else{
            s = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "";
            b = "b";
          }
          if ( j == 1 ){
            if ( OperInfo[ i ][ 3 ] == '2' )
              s = "\\widehat{"+s+"}"
              v = "\\widehat{"+v+"}"
          }

          if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ){
             str +=  indent+"\\FlaTwoByTwo{"+c+"_{TL}}{"+c+"_{TR}}\n";
             str +=  indent+"            {"+c+"_{BL}}{"+c+"_{BR}}\n";
             str +=  indent+"\\leftarrow\n";
             str +=  indent+"\\FlaThreeByThree"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str +=  "{"+c+"_{00}}{"+v+"_{01}}{"+c+"_{02}}\n";
             str +=  indent+"                  ";  
             str +=  "{"+v+"_{10}"+t+"}{"+s+"_{11}}{"+v+"_{12}"+t+"}\n";
             str +=  indent+"                  ";  
             str +=  "{"+c+"_{20}}{"+v+"_{21}}{"+c+"_{22}}\n$";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
          }
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ){
            t = "^T";
          }
          else{
            t = "" 
          }
          if ( j == 1 )
            v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaOneByTwo{"+c+"_L"+t+"}{"+c+"_R"+t+"}\n";
             str += "\\leftarrow";
             str += indent+"\\FlaOneByThree";
             str += DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0"+t+"}{"+v+"_1";
             if ( FnType != '0' )
               str += t;
             str += "}{"+c+"_2"+t+"}\n$\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     case '7': 
     case '8': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
            if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ) t = "^T";
            else t = "";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
            t = ""
          }
          tpadding = repeat( t.length, ' ' );

          if ( j == 1 )
             v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaTwoByOne{ "+c+"_T }\n";
             str += indent+"             { "+c+"_B }\n";
             str += "\\leftarrow\n";
             str += indent+"\\FlaThreeByOne";
             str += DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0}\n";
             str += indent+"               ";
             str += "{"+v+"_1"+t+"}\n";
             str += indent+"               ";
             str += "{"+c+"_2}\n$\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
   }
  }
  str = str+"}\n\n";

  return str;
}

function LContinue_Alg( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i, j;
  var c, v, s, t, tpadding, spadding;
  var b="";
  var firsttime=1, countperline=0;

  str += "% Step 5b: Move the double lines \n\n" 

  str += "\\renewcommand{\\moveboundaries}{\n"

  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ 2 ] == '0' ) continue
 
   for ( j=0; j<1; j++ ){
 
     c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
     if ( j == 1 ){
       if ( OperInfo[ i ][ 3 ] == '2' )
         c = "\\widehat{"+c+"}"
       else
         continue
     }

     if ( firsttime == 0 ){
       str +=",\n"
     }
     else
       firsttime = 0;

     //     countperline++;
     /*     if ( countperline > 2 ){
       str += "\\\\ \n";
       countperline = 0;
     }
     

     str += "$\n";
     */
     str += "$";

     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( FnType == '0' ){
            s = LAllChoices[ 0 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ 1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "^T";
            b = "1";
          }
          else{
            s = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "";
            b = "b";
          }
          if ( j == 1 ){
            if ( OperInfo[ i ][ 3 ] == '2' )
              s = "\\widehat{"+s+"}"
              v = "\\widehat{"+v+"}"
          }

          if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ){
             str +=  indent+"\\FlaTwoByTwo{"+c+"_{TL}}{"+c+"_{TR}}\n";
             str +=  indent+"            {"+c+"_{BL}}{"+c+"_{BR}}\n";
             str +=  indent+"\\leftarrow\n";
             str +=  indent+"\\FlaThreeByThree"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str +=  "{"+c+"_{00}}{"+v+"_{01}}{"+c+"_{02}}\n";
             str +=  indent+"                  ";  
             str +=  "{"+v+"_{10}"+t+"}{"+s+"_{11}}{"+v+"_{12}"+t+"}\n";
             str +=  indent+"                  ";  
             str +=  "{"+c+"_{20}}{"+v+"_{21}}{"+c+"_{22}}\n$";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
          }
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ){
            t = "^T";
          }
          else{
            t = "" 
          }
          if ( j == 1 )
            v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaOneByTwo{"+c+"_L"+t+"}{"+c+"_R"+t+"}\n";
             str += "\\leftarrow";
             str += indent+"\\FlaOneByThree";
             str += DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0"+t+"}{"+v+"_1";
             if ( FnType != '0' )
               str += t;
             str += "}{"+c+"_2"+t+"}\n$\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     case '7': 
     case '8': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
            if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ) t = "^T";
            else t = "";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
            t = ""
          }
          tpadding = repeat( t.length, ' ' );

          if ( j == 1 )
             v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaTwoByOne{ "+c+"_T }\n";
             str += indent+"             { "+c+"_B }\n";
             str += "\\leftarrow\n";
             str += indent+"\\FlaThreeByOne";
             str += DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0}\n";
             str += indent+"               ";
             str += "{"+v+"_1"+t+"}\n";
             str += indent+"               ";
             str += "{"+c+"_2}\n$\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
   }
  }
  str = str+"}\n\n";

  return str;
}

function LAfterRepartition( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i, j;
  var c, v, s, t, tpadding, spadding;
  var b="", whre="";
  var firsttime=1;

  str += "% Step 6: State after repartitioning\n" 
  str += "% Note: The below needs editing!!!\n\n"

  str += "\\renewcommand{\\beforeupdate}{\n"

  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ 2 ] == '0' ) continue
   if ( OperInfo[ i ][ 3 ] == '0' ) continue
 
   if ( firsttime == 0 )
     str +="\\wedge\n"
   else
     firsttime = 0;

   for ( j=0; j<1; j++ ){
     if ( j == 1 )
       str += "=\n"

     c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
     if ( j == 1 ){
       if ( OperInfo[ i ][ 3 ] != '0' )
         c = "\\widehat{"+c+"}"
       else
         continue
     }

     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( FnType == '0' ){
            s = LAllChoices[ 0 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ 1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "^T";
          }
          else{
            s = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "";
          }
          if ( j == 1 ){
            if ( OperInfo[ i ][ 3 ] != '0' )
              s = "\\widehat{"+s+"}"
              v = "\\widehat{"+v+"}"
          }

          if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ){
             str +=  indent+"\\FlaThreeByThree"+
                     DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str +=  "{"+c+"_{00}}{"+v+"_{01}}{"+c+"_{02}}\n";
             str +=  indent+"                  ";  
             str +=  "{"+v+"_{10}"+t+"}{"+s+"_{11}}{"+v+"_{12}"+t+"}\n";
             str +=  indent+"                  ";  
             str +=  "{"+c+"_{20}}{"+v+"_{21}}{"+c+"_{22}}\n";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
          }
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ){
            t = "^T";
          }
          else{
            t = "" 
          }
          if ( j == 1 )
            v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaOneByThree";
             str += DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0"+t+"}{"+v+"_1";
             if ( FnType != '0' )
               str += t;
             str += "}{"+c+"_2"+t+"}\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     case '7': 
     case '8': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
            if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ) t = "^T";
            else t = "";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
            t = ""
          }
          tpadding = repeat( t.length, ' ' );

          if ( j == 1 )
             v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaThreeByOne";
             str += DirChoicesAfterShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0}\n";
             str += indent+"               ";
             str += "{"+v+"_1"+t+"}\n";
             str += indent+"               ";
             str += "{"+c+"_2}\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
   }
  }
  str = str+"}\n\n";

  return str;
}



function LBeforeContinue( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";
  var i, j;
  var c, v, s, t, tpadding, spadding;
  var b="", whre="";
  var firsttime=1;

  str += "% Step 7: State after moving of double lines\n" 
  str += "% Note: The below needs editing!!!\n\n"

  str += "\\renewcommand{\\afterupdate}{\n"

  for (i=0; i<NumOpers; i++ ){
   if ( OperInfo[ i ][ 2 ] == '0' ) continue
   if ( OperInfo[ i ][ 3 ] == '0' ) continue
 
   if ( firsttime == 0 )
     str +="\\wedge\n"
   else
     firsttime = 0;

   for ( j=0; j<1; j++ ){
     if ( j == 1 )
       str += "=\n"

     c = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
     if ( j == 1 ){
       if ( OperInfo[ i ][ 3 ] != '0' )
         c = "\\widehat{"+c+"}"
       else
         continue
     }

     switch( OperInfo[ i ][ 2 ] ){
     case '1':
     case '2':
     case '3':
     case '4':
          if ( FnType == '0' ){
            s = LAllChoices[ 0 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ 1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "^T";
          }
          else{
            s = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            t = "";
          }
          if ( j == 1 ){
            if ( OperInfo[ i ][ 3 ] != '0' )
              s = "\\widehat{"+s+"}"
              v = "\\widehat{"+v+"}"
          }

          if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ){
             str +=  indent+"\\FlaThreeByThree"+
                     DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str +=  "{"+c+"_{00}}{"+v+"_{01}}{"+c+"_{02}}\n";
             str +=  indent+"                  ";  
             str +=  "{"+v+"_{10}"+t+"}{"+s+"_{11}}{"+v+"_{12}"+t+"}\n";
             str +=  indent+"                  ";  
             str +=  "{"+c+"_{20}}{"+v+"_{21}}{"+c+"_{22}}\n";
          }
          else{
             str += "Cannot split non-matrix into four quadrants\n"; 
             return str;
         }
         break;
     case '5': 
     case '6': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
          }
          if ( OperInfo[ i ][ OPERAND_TYPE ] == '1' ){
            t = "^T";
          }
          else{
            t = "" 
          }
          if ( j == 1 )
            v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaOneByThree";
             str += DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0"+t+"}{"+v+"_1";
             if ( FnType != '0' )
               str += t;
             str += "}{"+c+"_2"+t+"}\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     case '7': 
     case '8': 
          if ( FnType == '0' ){
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ]-1 ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "1";
            if ( OperInfo[ i ][ OPERAND_TYPE ] == '2' ) t = "^T";
            else t = "";
          }
          else{
            v = LAllChoices[ OperInfo[ i ][ OPERAND_TYPE ] ][ OperInfo[ i ][ OPERAND_NAME ] ];
            b = "b";
            t = ""
          }
          tpadding = repeat( t.length, ' ' );

          if ( j == 1 )
             v = "\\widehat{"+v+"}"

          if ( OperInfo[ i ][ OPERAND_TYPE ] != '0' ){
             str += indent+"\\FlaThreeByOne";
             str += DirChoicesBeforeShort[ OperInfo[ i ][ 2 ] ];
             str += "{"+c+"_0}\n";
             str += indent+"               ";
             str += "{"+v+"_1"+t+"}\n";
             str += indent+"               ";
             str += "{"+c+"_2}\n";
          }
          else{
             str += "Cannot split scalar\n"; 
             return str;
         }
         break;
     } 
   }
  }
  str = str+"}\n\n";

  return str;
}

function LUpdate( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str = "";

  str += "% Step 8: Insert the updates required to change the \n"
  str += "%         state from that given in Step 6 to that given in Step 7\n"
 
  str += "% Note: The below needs editing!!!\n\n"

  str += "\\renewcommand{\\update}{\n"

  str += "$\n";
  
  str += indent+"\\begin{array}{l}\n";
  str += indent+indent+"\\mbox{update line 1} \\\\ \n";
  str += indent+indent+"\\mbox{\\ \\ \\ \\ :} \\\\ \n";
  str += indent+indent+"\\mbox{update line n} \\\\ \n";
  str += indent+"\\end{array}\n";
  
  str += "$\n";

  str += "}\n\n";

  return str;
}

function LFooter( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";

  str += "\\begin{figure}[tbp]\n";
  str += "\n";
  str += "\\begin{center}     % center the algorithm on the page \n";
  str += "\\footnotesize      % make the font smaller so things fit on a page \n";
  str += " \n";
  str += "\\worksheet         % this command generates the worksheet using the \n";
  str += "                   % commands that were defined between the \\resetsteps \n";
  str += "                   % and the \worksheet command \n";
  str += "\\end{center} \n";
  str += " \n";
  str += "% The following command creates a caption for the figure. \n";
  str += " \n";
  str += "\\caption{ Worksheet for deriving the ";
  str += BlkChoices[ FnType ];
  str += " algorithm for \n";
  str += "$\\operation$ ";
  if ( Variant != '0' )
    str += "(Variant "+Variant+")";
  str += ".} \n";
  str += " \n";
  str += " \n";
  str += "% The following command creates a label so that the figure can \n";
  str += "% be referenced by its number by inserting  \n";
  str += "%  \\ref{";
  str += FnName+":ws_"+BlkChoicesShort[ FnType ];
  if ( Variant != '0' )
    str += "_var"+Variant;
  str += "} in the \\LaTeX source \n";
  str += " \n";
  str += "\\label{"
  str += FnName+":ws_"+BlkChoicesShort[ FnType ];
  if ( Variant != '0' )
    str += "_var"+Variant;
  str += "} \n";
  str += " \n";
  str += "\\end{figure} \n\n";

  return str;
}

function LFooter_Alg( FnName, FnType, Variant, NumOpers, OperInfo ){
  var str="";

  str += "\\begin{figure}[tbp]\n";
  str += "\n";
  str += "\\begin{center}     % center the algorithm on the page \n";
  str += " \n";
  str += "\\FlaAlgorithm     % this command generates the algorithm \n";
  str += "\\end{center} \n";
  str += " \n";
  str += "% The following command creates a caption for the figure. \n";
  str += " \n";
  str += "\\caption{";
  str += BlkChoicesCap[ FnType ];
  str += " algorithm for \n";
  str += "$\\operation$ ";
  if ( Variant != '0' )
    str += "(Variant "+Variant+")";
  str += ".} \n";
  str += " \n";
  str += " \n";
  str += "% The following command creates a label so that the figure can \n";
  str += "% be referenced by its number by inserting  \n";
  str += "%  \\ref{";
  str += FnName+":alg_"+BlkChoicesShort[ FnType ];
  if ( Variant != '0' )
    str += "_var"+Variant;
  str += "} in the \\LaTeX source \n";
  str += " \n";
  str += "\\label{"
  str += FnName+":alg_"+BlkChoicesShort[ FnType ];
  if ( Variant != '0' )
    str += "_var"+Variant;
  str += "} \n";
  str += " \n";
  str += "\\end{figure} \n\n";
  str += "\\end{document}\n";

  return str;
}

function repeat( n, c ){
  var str = "";
  var i;

  for ( i=0; i<n; i++ )
    str += c;

  return str
} 
  