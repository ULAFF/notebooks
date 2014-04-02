from numpy import matrix
from numpy import shape 

def dots(x, y, alpha ):
    """
    Compute alpha = x' * y + alpha, storing the result in alpha and updating 
    alpha.
    
    x and y can be row and/or column vectors.  If necessary, an
    implicit transposition happens.
    """
    
    assert type(x) is matrix and len(x.shape) is 2, \
           "laff.dots: vector x must be a 2D numpy.matrix"

    assert type(y) is matrix and len(y.shape) is 2, \
           "laff.dots: vector y must be a 2D numpy.matrix"

    assert type(alpha) is matrix and len(alpha.shape) is 2, \
           "laff.dots: scalar alpha must be contained in a 2D numpy.matrix"
                
    if(type(alpha) is matrix): m_alpha, n_alpha = alpha.shape
        
    assert (m_alpha is 1 and n_alpha is 1), \
           "laff.dots: alpha must be a 1 x 1 matrix"
        
    m_x, n_x = x.shape
    m_y, n_y = y.shape
    
    assert m_x is 1 or n_x is 1, "laff.dots: x is not a vector"
    assert m_y is 1 or n_y is 1, "laff.dots: y is not a vector"
    
    
    if m_x is 1 and m_y is 1: # x is a row, y is a row
        assert n_x == n_y, "laff.dots: size mismatch between x and y"
        if(type(alpha) is matrix):
            for i in range(n_x): alpha[0,0] += y[0, i] * x[0, i]
        else:
            for i in range(n_x): alpha += y[0, i] * x[0, i]
            
    elif n_x is 1 and n_y is 1: # x is a column, y is a column
        assert m_x == m_y, "laff.dots: size mismatch between x and y"
        if(type(alpha) is matrix):
            for i in range(m_x): alpha[0,0] += y[i, 0] * x[i, 0]
        else:
            for i in range(m_x): alpha += y[i, 0] * x[i, 0]
            
    elif m_x is 1 and n_y is 1: # x is a row, y is a column
        assert n_x == m_y, "laff.dots: size mismatch between x and y"
        if(type(alpha) is matrix):
            for i in range(n_x): alpha[0,0] +=  y[i, 0] * x[0, i]
        else:
            for i in range(n_x): alpha +=  y[i, 0] * x[0, i]
            
    elif n_x is 1 and m_y is 1: # x is a column, y is a row
        assert m_x == n_y, "laff.dots: size mismatch between x and y"
        if(type(alpha) is matrix):
            for i in range(m_x): alpha += y[0, i] * x[i, 0]
        else:
            for i in range(m_x): alpha += y[0, i] * x[i, 0]
            
