from numpy import matrix
from numpy import shape 

def invscal(alpha, x):
    """
    Compute 1/alpha * x, overwriting x
    
    x can be row or column vectors.
    """
    
    assert type(x) is matrix and len(x.shape) is 2, \
           "laff.invscal: vector x must be a 2D numpy.matrix"
        
    if(type(alpha) is matrix):
        m_alpha, n_alpha = alpha.shape
        
    assert isinstance(alpha,(int,float,complex)) or (m_alpha is 1 and n_alpha is 1), \
           "laff.invscal: alpha must be a scalar or a 1 x 1 matrix"

    m_x, n_x = x.shape
    
    assert m_x is 1 or n_x is 1, "laff.copy: x is not a vector"

    if m_x is 1: # x is a row
        for i in range(n_x): x[0, i] = x[0, i] / alpha[ 0,0 ]
            
    elif n_x is 1: # x is a column
        for i in range(m_x): x[i, 0] = x[i, 0] / alpha[ 0,0 ]
