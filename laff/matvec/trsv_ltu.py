import flame
from laff import scal
from laff import dots

def trsv_ltu(L, B):

    LTL, LTR, \
    LBL, LBR  = flame.part_2x2(L, \
                               0, 0, 'TL')

    BT, \
    BB  = flame.part_2x1(B, \
                         0, 'TOP')

    while LTL.shape[0] < L.shape[0]:

        L00,  l01,      L02,  \
        l10t, lambda11, l12t, \
        L20,  l21,      L22   = flame.repart_2x2_to_3x3(LTL, LTR, \
                                                        LBL, LBR, \
                                                        1, 1, 'BR')

        B0,  \
        b1t, \
        B2   = flame.repart_2x1_to_3x1(BT, \
                                       BB, \
                                       1, 'BOTTOM')

        #------------------------------------------------------------#

        dots( -l21, b2, beta1 )
        scal( 1/lambda11, beta1 )

        #------------------------------------------------------------#

        LTL, LTR, \
        LBL, LBR  = flame.cont_with_3x3_to_2x2(L00,  l01,      L02,  \
                                               l10t, lambda11, l12t, \
                                               L20,  l21,      L22,  \
                                               'TL')

        BT, \
        BB  = flame.cont_with_3x1_to_2x1(B0,  \
                                         b1t, \
                                         B2,  \
                                         'TOP')

    flame.merge_2x1(BT, \
                    BB, B)