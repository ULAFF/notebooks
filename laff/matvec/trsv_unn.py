import flame
from laff import scal
from laff import dots

def trsv_unn(U, b):

    UTL, UTR, \
    UBL, UBR  = flame.part_2x2(U, \
                               0, 0, 'BR')

    bT, \
    bB  = flame.part_2x1(b, \
                         0, 'BOTTOM')

    while UBR.shape[0] < U.shape[0]:

        U00,  u01,       U02,  \
        u10t, upsilon11, u12t, \
        U20,  u21,       U22   = flame.repart_2x2_to_3x3(UTL, UTR, \
                                                         UBL, UBR, \
                                                         1, 1, 'TL')

        b0,    \
        beta1, \
        b2     = flame.repart_2x1_to_3x1(bT, \
                                         bB, \
                                         1, 'TOP')

        #------------------------------------------------------------#

        dots( -u12t, b2, beta1 )
        scal( 1/upsilon11, beta1 )

        #------------------------------------------------------------#

        UTL, UTR, \
        UBL, UBR  = flame.cont_with_3x3_to_2x2(U00,  u01,       U02,  \
                                               u10t, upsilon11, u12t, \
                                               U20,  u21,       U22,  \
                                               'BR')

        bT, \
        bB  = flame.cont_with_3x1_to_2x1(b0,    \
                                         beta1, \
                                         b2,    \
                                         'BOTTOM')

    flame.merge_2x1(bT, \
                    bB, b)
