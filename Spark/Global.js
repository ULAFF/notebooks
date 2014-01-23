var  Matrices = new Array("A", "B", "C", "D" );
var  Vectors =  new Array("a", "b", "c", "d" );
var  Scalars =  new Array("alpha", "beta", "gamma", "delta" );
var  Fills =    new Array("    ", "   ", "    ", "     " );

nchoices = 22;

var  MChoices = new Array(
"A", "B", "C", "D", "E", "F", 
"G", "H", "L", "M", "N", "P", 
"Q", "R", "S", "T", "U", "V", 
"W", "X", "Y", "Z");

var  VChoices = new Array(
"a", "b", "c", "d", "e", "f", 
"g", "h", "l", "m", "n", "p", 
"q", "r", "s", "t", "u", "v", 
"w", "x", "y", "z");
var  SChoices =  new Array( 
"alpha", "beta", "gamma", "delta", "epsilon", "phi", "chi", "eta", "lambda", "mu", "nu", "pi", "chi", "rho", "sigma", "tau", "upsilon", "nu", "omega", "chi", "psi", "zeta" );
var  SFill =  new Array( "    ", "   ", "    ", "    ", "     ", "  ", "  ", "  ", "     ", " ", " ", " ", "  ", "  ", "    ", "  ", "     ", " ", "    ", "  ", "  ", "   " );

var  LSChoices =  new Array( "\\alpha", "\\beta", "\\gamma", "\\delta", "\\epsilon", "\\phi", "\\chi", "\\eta", "\\lambda", "\\mu", "\\nu", "\\pi", "\\chi", "\\rho", "\\sigma", "\\tau", "\\upsilon", "\\nu", "\\omega", "\\chi", "\\psi", "\\zeta" );
var  SFill =  new Array( "    ", "   ", "    ", "    ", "     ", "  ", "  ", "  ", "     ", " ", " ", " ", "  ", "  ", "    ", "  ", "     ", " ", "    ", "  ", "  ", "   " );

var AllChoices = new Array( SChoices, VChoices, MChoices );

var LAllChoices = new Array( LSChoices, VChoices, MChoices );

nblkchoices = 3;

var BlkChoices = new Array( "unblocked", "blocked", "recursive" );
var BlkChoicesCap = new Array( "Unblocked", "Blocked", "Recursive" );
var BlkChoicesShort = new Array( "unb", "blk", "rec" );

var BLK = new Array( "unb", "blk", "rec" );

var DefaultFnType = 0;

var ntypes = 3;

var TypeChoices = new Array( "scalar", "vector", "matrix" );

var ndirs = 9;

var SDirChoices = new Array(" none ");
var VDirChoices = new Array(" L->R ", " R->L ", " T->B ", " B->T ");
var MDirChoices = new Array("TL->BR", "BR->TL", "TR->BL", "BL->TR"); 

var DirChoices = new Array( " none ", "TL->BR", "BR->TL", "TR->BL", "BL->TR", 
                            " L->R ", " R->L ", " T->B ", " B->T " );

var DirChoicesBefore = new Array( "none", "'FLA_TL'", "'FLA_BR'", "'FLA_TR'", "'FLA_BL'", 
                            "'FLA_LEFT'", "'FLA_RIGHT'", "'FLA_TOP'", "'FLA_BOTTOM'" );

var DirChoicesAfter = new Array( "none", "'FLA_BR'", "'FLA_TL'", "'FLA_BL'", "'FLA_TR'", 
                            "'FLA_RIGHT'", "'FLA_LEFT'", "'FLA_BOTTOM'", "'FLA_TOP'" );

var DirChoicesBeforeShort = new Array( "none", "TL", "BR", "TR", "BL", 
                            "L", "R", "T", "B" );

var DirChoicesAfterShort = new Array( "none", "BR", "TL", "BL", "TR", 
                            "R", "L", "B", "T" );

var CDirChoicesBefore = new Array( "none", "FLA_TL", "FLA_BR", "FLA_TR", "FLA_BL", 
                            "FLA_LEFT", "FLA_RIGHT", "FLA_TOP", "FLA_BOTTOM" );

var CDirChoicesAfter = new Array( "none", "FLA_BR", "FLA_TL", "FLA_BL", "FLA_TR", 
                            "FLA_RIGHT", "FLA_LEFT", "FLA_BOTTOM", "FLA_TOP" );

var PDirChoicesBefore = new Array( "none", "PLA_TL", "PLA_BR", "PLA_TR", "PLA_BL", 
                            "PLA_LEFT", "PLA_RIGHT", "PLA_TOP", "PLA_BOTTOM" );

var PDirChoicesAfter = new Array( "none", "PLA_BR", "PLA_TL", "PLA_BL", "PLA_TR", 
                            "PLA_RIGHT", "PLA_LEFT", "PLA_BOTTOM", "PLA_TOP" );

var nios = 3;

var IoChoices = new Array( "input", "temporary", "input/output" );

var DefaultFncName = "Function Name";

var nOperChoices = 6;

//var OperChoices = new Array( "0", "1", "2", "3", "4", "5" );
var OperChoices = new Array( "1", "2", "3", "4", "5" );
var nvarchoices = 21;
var VarChoices = new Array( "none", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                      "11", "12", "13", "14", "15", "16", "17", "18", "19", "20" );

var OperandInfo0 = new Array( 0, 2, 1, 2 ); 
var OperandInfo1 = new Array( 1, 2, 1, 0 ); 

var DefaultOperandInfo = new Array( OperandInfo0, OperandInfo1 );

var LanguageChoices = new Array( "FLAME@lab", "FLAMEC", "PLAPACK", "FLaTeX - Worksheet", "FLaTeX - Algorithm", "FlamePy" );

var nlanguages = LanguageChoices.length;

var DefaultLanguage = 5;

var 
   HEADER = 0,
   PART = 1,
   GUARD = 2,
   REPART = 3,
   COMMENTBAR = 4, 
   CONT = 5, 
   ENDGUARD = 5;
   FOOTER = 6;


OPERAND_NAME = 0;
OPERAND_TYPE = 1;
OPERAND_DIR = 2;
OPERAND_IO = 3;

IO_IN = '0';
IO_TMP = '1';
IO_INOUT = '2';

TYPE_MATRIX = '2';
TYPE_VECTOR = '1';
TYPE_SCALAR = '0';

var added = 0;
var indent="  ";

function repetition(rep, c){
  var i, str="";
  for (i = 0; i != rep; ++i)
	str += c;
  return str;
}

function ws(n){
  return repetition(n, " ");
}

function Opposite(part){
  var str = "";
  switch(part){
   case "TL": str = "BR";
	      break;
   case "TR": str = "BL";
	      break;
   case "BR": str = "TL";
	      break;
   case "BL": str = "TR";
	      break;
   case "TOP": str = "BOTTOM";
	      break;
   case "BOTTOM": str = "TOP";
	      break;
   case "RIGHT": str = "LEFT";
	      break;
   case "LEFT": str = "RIGHT";
	      break;
  }
  return str;
}

function Create_Multiple(n, types, partitions, fn){
  var i, str="";

  for (i = 0; i != n; ++i)
    if (partitions[i] != "NIL")
       if ( types[ i ] == "vector" )
         str += fn(i, types[ i ], Vectors[i], partitions[i], 0);
       else
         str += fn(i, types[ i ], Matrices[i], partitions[i], 0);

  return str;
}

function Create_Multiple_out(n, types, partitions, IOS, fn){
  var i, str="";

  for (i = 0; i != n; ++i)
    if (partitions[i] != "NIL" && IOS[i] == "both" )
       if ( types[ i ] == "vector" )
         str += fn(i, types[ i ], Vectors[i], partitions[i], 0);
       else
         str += fn(i, types[ i ], Matrices[i], partitions[i], 0);

  return str;
}

function PartitionCheck(TL, T, L){
  var str = "";
  return str;
}

