from random import randrange
from random import seed
from sys import exit
from numpy import eye
from numpy import mat
from laff.util.RandomInt import RandomInt

def RandomMatrixForGaussJordan( size, UseSeed=[] ):

    if UseSeed != []:
        seed( UseSeed )
    else:
        seed()

    A = mat( eye( size ) )

    # Scale the rows
    for i in range( 0, size ):
        A[ i,i ] = RandomInt( -2, 2, 'False' )

    # Generate and apply upper triangular Gauss transforms
    for j in range( 1, size ):
        for i in range( 0,j ):
            # multiplier i,j
            mij = RandomInt( -2, 2, 'False' )
            A[ i,: ] += -mij * A[ j,: ]

            # Generate and apply lower triangular Gauss transforms
    for jj in range( 1, size ):
        j = size-jj-1
        for i in range( j+1, size ):
            # multiplier i,j
            mij = RandomInt( -2, 2, 'False' )
            A[ i,: ] += -mij * A[ j,: ]


    return A
