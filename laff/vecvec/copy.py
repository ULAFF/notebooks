from numpy import matrix
from numpy import shape 

def copy(x, y):
    """
    Compute y = x, overwriting y
    
    x and y can be row and/or column vectors.  If necessary, an
    implicit transposition happens.
    """
    
    assert type(x) is matrix and len(x.shape) is 2, \
           "laff.copy: vector x must be a 2D numpy.matrix"

    assert type(y) is matrix and len(y.shape) is 2, \
           "laff.copy: vector y must be a 2D numpy.matrix"

    m_x, n_x = x.shape
    m_y, n_y = y.shape
    
    assert m_x is 1 or n_x is 1, "laff.copy: x is not a vector"
    assert m_y is 1 or n_y is 1, "laff.copy: y is not a vector"

    if m_x is 1 and m_y is 1: # x is a row, y is a row
        assert n_x == n_y, "laff.copy: size mismatch between x and y"
        for i in range(n_x): y[0, i] = x[0, i]
            
    elif n_x is 1 and n_y is 1: # x is a column, y is a column
        assert m_x == m_y, "laff.copy: size mismatch between x and y"
        for i in range(m_x): y[i, 0] = x[i, 0]
            
    elif m_x is 1 and n_y is 1: # x is a row, y is a column
        assert n_x == m_y, "laff.copy: size mismatch between x and y"
        for i in range(n_x): y[i, 0] = x[0, i]
            
    elif n_x is 1 and m_y is 1: # x is a column, y is a row
        assert m_x == n_y, "laff.copy: size mismatch between x and y"
        for i in range(m_x): y[0, i] = x[i, 0]
