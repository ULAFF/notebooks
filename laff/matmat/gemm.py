from numpy import matrix

def gemm(alpha, A, B, beta, C):
	"""
	Implementing a blocked, fully optimized matrix-matrix multiply in FlamePY 
	would be great, but the TAs didn't have time to do it. We elected
	to use numpy's gemm call which uses an optimized version of the ATLAS
	library written in C (or possibly Fortran77) until an ambitious student
	takes on the task. 

	This routine modifies C with C := alpha * A * B + beta * C
	"""


	if (type(alpha) is matrix and len(alpha.shape) == 2):
		assert( alpha.shape[0] == 1 and alpha.shape[1] == 1 ), "laff.gemm: alpha must be a number or a 1x1 matrix"
	else:
		assert ( isinstance(alpha, (int, float, complex ))), "laff.gemm: alpha must be a number or a 1x1 matrix"

	if (type(beta) is matrix and len(beta.shape) == 2):
		assert( beta.shape[0] == 1 and beta.shape[1] == 1 ), "laff.gemm: beta must be a number or a 1x1 matrix"
	else:
		assert ( isinstance(beta, (int, float, complex ))), "laff.gemm: beta must be a number or a 1x1 matrix"

	assert( type(A) is matrix and len(A.shape) == 2 ), "laff.gemm: A must be a 2D numpy matrix"

	assert( type(B) is matrix and len(B.shape) == 2 ), "laff.gemm: B must be a 2D numpy matrix"

	assert( type(C) is matrix and len(C.shape) == 2 ), "laff.gemm: C must be a 2D numpy matrix"

	# Update C using the built-in numpy multiply
	C[:,:] = alpha * A * B + beta * C