from numpy import matrix
from numpy import shape 

def dot(x, y, alpha=0):
    """
    Compute alpha = xy + alpha, storing the incremental sum in alpha
    
    x and y can be row and/or column vectors.  If necessary, an
    implicit transposition happens.
    """
    
    assert type(x) is matrix and len(x.shape) is 2, \
           "laff.dot: vector x must be a 2D numpy.matrix"

    assert type(y) is matrix and len(y.shape) is 2, \
           "laff.dot: vector y must be a 2D numpy.matrix"
                
    if(type(alpha) is matrix): m_alpha, n_alpha = alpha.shape
        
    assert isinstance(alpha,(int,float,complex)) or (m_alpha is 1 and n_alpha is 1), \
           "laff.scal: alpha must be a 1 x 1 matrix"
        
    if(type(alpha) is matrix): alpha[0,0] = 0
    else: alpha = 0

    m_x, n_x = x.shape
    m_y, n_y = y.shape
    
    assert m_x is 1 or n_x is 1, "laff.dot: x is not a vector"
    assert m_y is 1 or n_y is 1, "laff.dot: y is not a vector"
    
    
    if m_x is 1 and m_y is 1: # x is a row, y is a row
        assert n_x == n_y, "laff.dot: size mismatch between x and y"
        if(type(alpha) is matrix):
            for i in range(n_x): alpha[0,0] += y[0, i] * x[0, i]
        else:
            for i in range(n_x): alpha += y[0, i] * x[0, i]
            
    elif n_x is 1 and n_y is 1: # x is a column, y is a column
        assert m_x == m_y, "laff.dot: size mismatch between x and y"
        if(type(alpha) is matrix):
            for i in range(m_x): alpha[0,0] += y[i, 0] * x[i, 0]
        else:
            for i in range(m_x): alpha += y[i, 0] * x[i, 0]
            
    elif m_x is 1 and n_y is 1: # x is a row, y is a column
        assert n_x == m_y, "laff.dot: size mismatch between x and y"
        if(type(alpha) is matrix):
            for i in range(n_x): alpha[0,0] +=  y[i, 0] * x[0, i]
        else:
            for i in range(n_x): alpha +=  y[i, 0] * x[0, i]
            
    elif n_x is 1 and m_y is 1: # x is a column, y is a row
        assert m_x == n_y, "laff.dot: size mismatch between x and y"
        if(type(alpha) is matrix):
            for i in range(m_x): alpha += y[0, i] * x[i, 0]
        else:
            for i in range(m_x): alpha += y[0, i] * x[i, 0]
            
    return alpha
