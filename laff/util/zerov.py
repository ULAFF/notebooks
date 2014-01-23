from numpy import matrix
from numpy import shape 

def zerov(x):
    """
    Set all components of x to zero
    
    x can be a row and/or column vectors.  
    """
    
    assert type(x) is matrix and len(x.shape) is 2, \
           "laff.zerov: vector x must be a 2D numpy.matrix"

    m_x, n_x = x.shape
    
    assert m_x is 1 or n_x is 1, "laff.zerov: x is not a vector"

    if m_x is 1 is 1: # x is a row
        for i in range(n_x): x[0, i] = 0.
            
    elif n_x is 1 is 1: # x is a column
        for i in range(m_x): x[i, 0] = 0.
            
