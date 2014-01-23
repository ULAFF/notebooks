/* CONSTANTS */

// Some constants are defined in Global.js

DIR_NONE = 0;
DIR_TLBR = 1;
DIR_BRTL = 2;
DIR_TRBL = 3;
DIR_BLTR = 4;
DIR_LR   = 5;
DIR_RL   = 6;
DIR_TB   = 7;
DIR_BT   = 8;

FN_UNB = 0;
FN_BLK = 1;
FN_REC = 2;

TYPE_SCA = 0;
TYPE_VEC = 1;
TYPE_MAT = 2;

IO_INPUT = 0;
IO_TEMP  = 1;
IO_IO    = 2;

/* UTILITY FUNCTIONS */

function isScalar(operand)
{
	if (operand[OPERAND_TYPE] == TYPE_SCA)
		return true;
	else
		return false;
}


function isVector(operand)
{
	if (operand[OPERAND_TYPE] == TYPE_VEC)
		return true;
	else
		return false;
}


function isMatrix(operand)
{
	if (operand[OPERAND_TYPE] == TYPE_MAT)
		return true;
	else
		return false;
}


function scalarForm(operand)
{
	return AllChoices[0][operand[OPERAND_NAME]];
}


function vectorForm(operand)
{
	return AllChoices[1][operand[OPERAND_NAME]];
}

function matrixForm(operand)
{
	return AllChoices[2][operand[OPERAND_NAME]];
}

function defaultForm(operand)
{
	return AllChoices[operand[OPERAND_TYPE]][operand[OPERAND_NAME]];
}


function isTwoDimensional(operand)
{
	if (1 <= operand[OPERAND_DIR] && operand[OPERAND_DIR] <= 4)
		return true;
	else
		return false;
}


function isHorizontal(operand)
{
	if (5 <= operand[OPERAND_DIR] && operand[OPERAND_DIR] <= 6)
		return true;
	else
		return false;
}


function isVertical(operand)
{
	if (7 <= operand[OPERAND_DIR] && operand[OPERAND_DIR] <= 8)
		return true;
	else
		return false;
}
