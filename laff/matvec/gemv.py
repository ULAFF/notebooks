from numpy import matrix
from numpy import shape 
from numpy import transpose

def gemv(trans, alpha, A, x, beta, y):
    """
    Compute y := alpha * A * x + beta * y
    
    x and y can be row and/or column vectors.  If necessary, a
    transposition happens with those vectors.
    """

    """ 
    Check parameters
    """
    assert (trans == 'No transpose' or trans == 'Transpose'), "laff.gemv: illegal value for trans"

    if(type(alpha) is matrix):
        m_alpha, n_alpha = alpha.shape
        assert m_alpha is 1 and n_alpha is 1, "laff.gemv: alpha is neither a scalar nor a 1 x 1 matrix"
        scalar_alpha = alpha[0,0]
    else:
        assert isinstance( alpha, (int,float,complex)), "laff.gemv: alpha is neither a scalar nor a 1 x 1 matrix"
        scalar_alpha = alpha

    assert type(A) is matrix and len(A.shape) is 2, \
           "laff.gemv: matrix A must be a 2D numpy.matrix"

    assert type(x) is matrix and len(x.shape) is 2, \
           "laff.gemv: vector x must be a 2D numpy.matrix"

    if(type(beta) is matrix):
        m_beta, n_beta = beta.shape
        assert m_beta is 1 and n_beta is 1, "laff.gemv: beta is neither a scalar nor a 1 x 1 matrix"
        scalar_beta = beta[0,0]
    else:
        assert isinstance( beta, (int,float,complex)), "laff.gemv: beta is neither a scalar nor a 1 x 1 matrix"
        scalar_beta = beta

    assert type(y) is matrix and len(y.shape) is 2, \
           "laff.gemv: vector y must be a 2D numpy.matrix"

        


    """ 
    Extract sizes
    """           
    m_x, n_x = x.shape
    m_y, n_y = y.shape
    m_A, n_A = A.shape


    assert m_x is 1 or n_x is 1, "laff.gemv: x is not a vector"
    assert m_y is 1 or n_y is 1, "laff.axpy: y is not a vector"

    if 'No transpose' == trans:
        if m_x is 1 and m_y is 1: # x is a row, y is a row
            assert n_y == m_A, "laff.gemv: size mismatch between y and A"
            assert n_x == n_A, "laff.gemv: size mismatch between x and A"
            y[0,:] = scalar_alpha * x * transpose( A ) + scalar_beta * y[0,:];
            
        elif n_x is 1 and n_y is 1: # x is a column, y is a column
            assert m_y == m_A, "laff.gemv: size mismatch between y and A"
            assert m_x == n_A, "laff.gemv: size mismatch between x and A"
            y[:,0] = scalar_alpha * A * x + scalar_beta * y[:,0]

        elif m_x is 1 and n_y is 1: # x is a row, y is a column
            assert m_y == m_A, "laff.gemv: size mismatch between y and A"
            assert n_x == n_A, "laff.gemv: size mismatch between x and A"
            y[:,0] = scalar_alpha * A * transpose( x ) + scalar_beta * y[:,0]

        elif n_x is 1 and m_y is 1: # x is a column, y is a row
            assert n_y == m_A, "laff.gemv: size mismatch between y and A"
            assert m_x == n_A, "laff.gemv: size mismatch between x and A"
            y[0,:] = scalar_alpha * transpose( x ) * transpose( A ) + scalar_beta * y[0,:]
    else:
        if m_x is 1 and m_y is 1: # x is a row, y is a row
            assert n_y == n_A, "laff.gemv: size mismatch between y and A"
            assert n_x == m_A, "laff.gemv: size mismatch between x and A"
            y[0,:] = scalar_alpha *  x  *  A  + scalar_beta * y[0,:]
            
        elif n_x is 1 and n_y is 1: # x is a column, y is a column
            assert m_y == n_A, "laff.gemv: size mismatch between y and A"
            assert m_x == m_A, "laff.gemv: size mismatch between x and A"
            y[:,0] = scalar_alpha * transpose( A ) * x + scalar_beta * y[:,0]

        elif m_x is 1 and n_y is 1: # x is a row, y is a column
            assert m_y == n_A, "laff.gemv: size mismatch between y and A"
            assert n_x == m_A, "laff.gemv: size mismatch between x and A"
            y[:,0] = scalar_alpha * transpose( A ) * transpose( x ) + scalar_beta * y[:,0]

        elif n_x is 1 and m_y is 1: # x is a column, y is a row
            assert n_y == n_A, "laff.gemv: size mismatch between y and A"
            assert m_x == m_A, "laff.gemv: size mismatch between x and A"
            y[0,:] = scalar_alpha * transpose( x ) * A + scalar_beta * y[0,:]
