from numpy import matrix
from numpy import shape 
from numpy import transpose

def ger(alpha, y, x, A):
    """
    Compute A := alpha * y * x + A
    
    x and y can be row and/or column vectors.  If necessary, a
    transposition happens.
    """

    """ 
    Check parameters
    """
    if(type(alpha) is matrix):
        m_alpha, n_alpha = alpha.shape
        assert m_alpha is 1 and n_alpha is 1, "laff.ger: alpha is neither a scalar nor a 1 x 1 matrix"
        scalar_alpha = alpha[0,0]
    else:
        assert isinstance( alpha, (int,float,complex)), "laff.ger: alpha is neither a scalar nor a 1 x 1 matrix"
        scalar_alpha = alpha

    assert type(y) is matrix and len(y.shape) is 2, \
           "laff.ger: vector y must be a 2D numpy.matrix"

    assert type(x) is matrix and len(x.shape) is 2, \
           "laff.ger: vector x must be a 2D numpy.matrix"
        
    assert type(A) is matrix and len(A.shape) is 2, \
           "laff.ger: matrix A must be a 2D numpy.matrix"


    """ 
    Extract sizes
    """           
    m_x, n_x = x.shape
    m_y, n_y = y.shape
    m_A, n_A = A.shape


    assert m_x is 1 or n_x is 1, "laff.ger: x is not a vector"
    assert m_y is 1 or n_y is 1, "laff.axpy: y is not a vector"

    if m_x is 1 and m_y is 1: # x is a row, y is a row
        assert n_y == m_A, "laff.ger: size mismatch between y and A"
        assert n_x == n_A, "laff.ger: size mismatch between x and A"
        A[:,:] = scalar_alpha * transpose( y ) * x + A
            
    elif n_x is 1 and n_y is 1: # x is a column, y is a column
        assert m_y == m_A, "laff.ger: size mismatch between y and A"
        assert m_x == n_A, "laff.ger: size mismatch between x and A"
        A[:,:] = scalar_alpha * y * transpose( x ) + A

    elif m_x is 1 and n_y is 1: # x is a row, y is a column
        assert m_y == m_A, "laff.ger: size mismatch between y and A"
        assert n_x == n_A, "laff.ger: size mismatch between x and A"
        A[:,:] = scalar_alpha * y * x + A

    elif n_x is 1 and m_y is 1: # x is a column, y is a row
        assert n_y == m_A, "laff.ger: size mismatch between y and A"
        assert m_x == n_A, "laff.ger: size mismatch between x and A"
        A[:,:] = scalar_alpha * transpose( y ) * transpose( x ) + A
