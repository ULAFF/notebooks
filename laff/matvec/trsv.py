from numpy import matrix
from numpy import shape 
from numpy import transpose
from laff.matvec.trsv_lnn import trsv_lnn 
from laff.matvec.trsv_lnu import trsv_lnu 
from laff.matvec.trsv_unn import trsv_unn 
from laff.matvec.trsv_unu import trsv_unu 
from laff.matvec.trsv_utn import trsv_utn
from laff.matvec.trsv_ltu import trsv_ltu
import sys


def trsv(uplo, trans, diag, A, b ):
    """
    Solve A x = b or trans( A ) x = b, overwriting b with x

    Parameter uplo indicates whether to use the lower triangular or
    upper triangular part of A:
    if uplo == 'Lower triangular':
       A is lower triangular
    elif upl == 'Upper triangular':
       A is upper trianglar

    Parameter trans indicates whether to transpose A:
    if trans == 'No transpose':
       solve A x = b
    elif trans == 'Transpose':
       solve trans( A ) x = b

    Parameter diag indicates whether A has an (implicit) unit diagonal:
    if diag == 'Unit diagonal':
       A has an implicit unit diagonal
    elif diag == 'Nonunit diagonal':
       Use the entries on the diagonal of A
       
    """

    """ 
    Check parameters
    """
    assert (uplo == 'Lower triangular' or uplo == 'Upper triangular'), "laff.trsv: illegal value for uplo"

    assert (trans == 'No transpose' or trans == 'Transpose'), "laff.trsv: illegal value for trans"

    assert (diag == 'Nonunit diagonal' or diag == 'Unit diagonal'), "laff.trsv: illegal value for diag"
        
    assert type(A) is matrix and len(A.shape) is 2, \
           "laff.trsv: matrix A must be a 2D numpy.matrix"

    assert type(b) is matrix and len(b.shape) is 2, \
           "laff.trsvv: vector b must be a 2D numpy.matrix"
        
    """ 
    Extract sizes
    """           
    m_A, n_A = A.shape
    m_b, n_b = b.shape

    assert m_b is 1 or n_b is 1, "laff.trsv: b is not a vector"

    if n_b is 1: # b is a column
        assert m_b == n_A, "laff.trsv: size mismatch between b and A"

        if 'Lower triangular' == uplo:

            if 'No transpose' == trans:

                if 'Nonunit diagonal' == diag:
                    trsv_lnn( A, b )
                else:
                    trsv_lnu( A, b )

            else:

                if 'Unit diagonal' == diag:
                    trsv_ltu( A, b )
                else:
                    print( "laff.trsv: trans == Transpose not yet implemented for Lower triangular, Transpose" )
                    sys.exit( 0 )

        else:  # 'Upper triangular' == uplo

            if 'No transpose' == trans:

                if 'Nonunit diagonal' == diag:
                    trsv_unn( A, b )
                else:
                    trsv_unu( A, b )

            else: # 'Transpose' == trans

                if 'Nonunit diagonal' == diag:
                        trsv_utn( A, b )
                else:
                    print( "laff.trsv: trans == Transpose not yet implemented for Upper Triangular with Unit diagonal" )
                    sys.exit( 0 )

    else:
        print( "laff.trsv: row b not yet implemented" )
        sys.exit( 0 )
