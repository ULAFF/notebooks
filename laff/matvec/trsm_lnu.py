import flame
import laff

def trsm_lnu(L, B):

    BL, BR = flame.part_1x2(B, \
                            0, 'LEFT')

    while BL.shape[1] < B.shape[1]:

        B0, b1, B2 = flame.repart_1x2_to_1x3(BL, BR, \
                                             1, 'RIGHT')

        #------------------------------------------------------------#

        laff.trsv( 'Lower triangular', 'No transpose', 'Unit diagonal', L, b1 )

        #------------------------------------------------------------#

        BL, BR = flame.cont_with_1x3_to_1x2(B0, b1, B2, \
                                            'LEFT')

    flame.merge_1x2(BL, BR, B)