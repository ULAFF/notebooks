import flame
import laff

from numpy import transpose

def trsm_utn(U, B):
    
    BT, \
    BB  = flame.part_2x1(B, \
                         0, 'TOP')

    while BT.shape[0] < B.shape[0]:

        B0,  \
        b1t, \
        B2   = flame.repart_2x1_to_3x1(BT, \
                                       BB, \
                                       1, 'BOTTOM')

        #------------------------------------------------------------#

        #TODO: Fix trsv.py to handle rows properly
        #Sorry for the hackiness in the fix here, I got pressed for time
        laff.trsv( 'Upper triangular', 'Transpose', 'Nonunit diagonal', U, transpose( b1t ) )
        
        #------------------------------------------------------------#

        BT, \
        BB  = flame.cont_with_3x1_to_2x1(B0,  \
                                         b1t, \
                                         B2,  \
                                         'TOP')

    flame.merge_2x1(BT, \
                    BB, B)