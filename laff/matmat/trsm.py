from numpy import matrix
from numpy import shape
from numpy import transpose
from laff.matmat.trsm_lnu import trsm_lnu
from laff.matmat.trsm_utn import trsm_utn
from laff.matmat.trsm_ltu import trsm_ltu
from laff.matmat.trsm_unn import trsm_unn
import sys




def trsm(uplo, trans, diag, A, B ):
    """
    Solve A X = B or trans( A X ) = trans( B ), overwriting B with X

    Parameter uplo indicates whether to use the lower triangular or
    upper triangular part of A:
    if uplo == 'Lower triangular':
       A is lower triangular
    elif upl == 'Upper triangular':
       A is upper trianglar

    Parameter trans indicates whether to transpose A:
    if trans == 'No transpose':
       solve A X = B
    elif trans == 'Transpose':
       solve trans( A X ) = trans( B )

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

    assert type(B) is matrix and len(B.shape) is 2, \
           "laff.trsvv: matrix B must be a 2D numpy.matrix"

    """
    Extract sizes
    """
    m_A, n_A = A.shape
    m_B, n_B = B.shape

    if 'Lower triangular' == uplo:

        if 'No transpose' == trans:

            if 'Unit diagonal' == diag:
                trsm_lnu( A, B )
            else:
                print( "laff.trsm: diag == Nonunit diagonal not yet implemented for Lower triangular" )
                sys.exit( 0 )
        else:

            if 'Unit diagonal' == diag:
                trsm_ltu( A, B )
            else:
                print( "laff.trsm: trans == Transpose not yet implemented for Lower triangular, nonunit diagonal" )
                sys.exit( 0 )

    else: #'Upper triangular' == uplo

        if 'No transpose' == trans:

            if 'Unit diagonal' == diag:
                print( "laff.trsm: trans == No transpose not yet implemented for Upper triangular, unit diagonal" )
                sys.exit( 0 )

            else:
                trsm_unn( A, B )

        else:

            if 'Unit diagonal' == diag:
                print( "laff.trsm: diag == Unit diagonal not yet implemented for Upper triangular" )
                sys.exit( 0 )
            else:
                trsm_utn( A, B )
