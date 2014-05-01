import flame
import laff

def chol_unb(A):

    ATL, ATR, \
    ABL, ABR  = flame.part_2x2(A, \
                               0, 0, 'TL')

    while ATL.shape[0] < A.shape[0]:

        A00,  a01,     A02,  \
        a10t, alpha11, a12t, \
        A20,  a21,     A22   = flame.repart_2x2_to_3x3(ATL, ATR, \
                                                       ABL, ABR, \
                                                       1, 1, 'BR')

        #------------------------------------------------------------#

        # alpha11[0,0] = np.sqrt( alpha11[0,0] )
        # laff.invscal( alpha11, a21 )
        # laff.ger( -1, a21, a21, A22 ) #Not tril

        # laff.dots( a10t, a10t, alpha11 )
        # alpha11[0,0] = np.sqrt( alpha11[0,0] )
        # a21 -= A20 * np.transpose(a10t) #Not laff calls
        # laff.invscal( alpha11, a21 )

        laff.trsv( 'Lower triangular', 'Nonunit diagonal', 'No transpose', A00, a10t )
        laff.dots( a10t, a10t, alpha11 )
        alpha11[0,0] = np.sqrt( alpha11[0,0] )

        #------------------------------------------------------------#

        ATL, ATR, \
        ABL, ABR  = flame.cont_with_3x3_to_2x2(A00,  a01,     A02,  \
                                               a10t, alpha11, a12t, \
                                               A20,  a21,     A22,  \
                                               'TL')

    flame.merge_2x2(ATL, ATR, \
                    ABL, ABR, A)
