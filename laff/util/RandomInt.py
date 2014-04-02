from random import randrange
from sys import exit

def RandomInt( Lower, Upper, ZeroIncluded ):
    """
    RandomInt( Lower, Upper, ZeroIncluded )

    Return random integer in range [ Lower, Upper ].
    ZeroIncluded == 'False' or 'True' indicates if zero 
    is an allowable value for return.
    """
    
    if ( 'True' == ZeroIncluded or Lower > 0 ):
        result = randrange( Lower, Upper+1, 1 )
    elif ( 'False' == ZeroIncluded ):
        result = randrange( Lower+1, Upper+1, 1 )
        if result <= 0:
            result -= 1
    else:
        print( 'RandomInt: Illegal ZeroIncluded' )
        exit( 1 )
        
    return result
