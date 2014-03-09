#hpart = 'horizontal partition', vpart = 'vertical partition'

from numpy import hstack, vstack

def merge_2x2(TL, TR, BL, BR, A):
    if TL.shape[0] > 0 and TL.shape[1] > 0:
        for i in range(TL.shape[0]):
            for j in range(TL.shape[1]):
                A[i,j] = TL[i,j];

    if TR.shape[0] > 0 and TR.shape[1]> 0:
        for i in range(TR.shape[0]):
            for j in range(TR.shape[1]):
               A[i, TL.shape[1] + j] = TR[i,j];

    if BL.shape[0] > 0 and BL.shape[1]> 0:
        for i in range(BL.shape[0]):
            for j in range(BL.shape[1]):
                A[i + TL.shape[0], j ] = BL[i,j];

    if BR.shape[0] > 0 and BR.shape[1]> 0:
        for i in range(BR.shape[0]):
            for j in range(BR.shape[1]):
                A[i+TL.shape[0], j+TL.shape[1]] = BR[i,j];


def merge_2x1(T, B, A):
    if T.shape[0] > 0 and T.shape[1] > 0:
        for i in range(T.shape[0]):
            for j in range(T.shape[1]):
                A[i,j] = T[i,j];

    if B.shape[0] > 0 and B.shape[1]> 0:
        for i in range(B.shape[0]):
            for j in range(B.shape[1]):
                A[i+T.shape[0], j] = B[i,j];



def merge_1x2(L, R, A):
    if L.shape[0] > 0 and L.shape[1] > 0:
        for i in range(L.shape[0]):
            for j in range(L.shape[1]):
                A[i,j] = L[i,j];

    if R.shape[0] > 0 and R.shape[1]> 0:
        for i in range(R.shape[0]):
            for j in range(R.shape[1]):
                A[i, j+L.shape[1]] = R[i,j];


def cont_with_1x3_to_1x2(A0, A1, A2, side='LEFT'):
    if side == 'LEFT':
        return hstack((A0, A1)), A2
    else:
        return A0, hstack((A1, A2))


def cont_with_3x1_to_2x1(A0, A1, A2, side='TOP'):
    if side == 'TOP':
        return vstack((A0, A1)), A2
    else:
        return A0, vstack((A1, A2))


def cont_with_3x3_to_2x2(A00, A01, A02, \
                         A10, A11, A12, \
                         A20, A21, A22, quad='TL'):
    if quad == 'TL':
        TL = vstack((hstack((A00, A01)), \
                     hstack((A10, A11))))
        TR = vstack((A02, \
                     A12))
        BL = hstack((A20, A21))
        BR = A22

    elif quad == 'TR':
        TL = vstack((A00, \
                     A10))
        TR = vstack((hstack((A01, A02)), \
                     hstack((A11, A12))))
        BL = A20
        BR = hstack((A21, A22))

    elif quad == 'BL':
        TL = hstack((A00, A01))
        TR = A02
        BL = vstack((hstack((A10, A11)), \
                     hstack((A20, A21))))
        BR = vstack((A12, \
                     A22))

    elif quad == 'BR':
        TL = A00
        TR = hstack((A01, A02))
        BL = vstack((A10, \
                     A20))
        BR = vstack((hstack((A11, A12)), \
                     hstack((A21, A22))))

    return TL, TR, \
           BL, BR


def part_1x2(A, size=0, side='LEFT'):
    if size < 0:
        raise IndexError('size < 0')
    elif size > A.shape[1]:
        raise IndexError('size > col dimension')
    elif side not in ('LEFT', 'RIGHT'):
        raise ValueError('side must be LEFT or RIGHT')

    vpart = size if side == 'LEFT' else A.shape[1] - size

    AL, AR = A[:, :vpart], A[:, vpart:]

    return AL, AR


def part_2x1(A, size=0, side='TOP'):
    if size < 0:
        raise IndexError('size < 0')
    elif size > A.shape[0]:
        raise IndexError('size > row dimension')
    elif side not in ('TOP', 'BOTTOM'):
        raise ValueError('side must be TOP or BOTTOM')

    hpart = size if side == 'TOP' else A.shape[0] - size

    AT, \
    AB  = A[:hpart, :], \
          A[hpart:, :]

    return AT, \
           AB


def part_2x2(A, m, n, quad):
    if quad not in ('TL', 'TR', 'BL', 'BR'):
        raise ValueError('quadrant must be TL, TR, BL, or BR')

    hpart = m if quad in ('TL', 'TR') else A.shape[0] - m
    vpart = n if quad in ('TL', 'BL') else A.shape[1] - n

    TL, TR = A[:hpart, :vpart], A[:hpart, vpart:]
    BL, BR = A[hpart:, :vpart], A[hpart:, vpart:]

    return TL, TR, BL, BR


def repart_1x2_to_1x3(AL, AR, n=1, side='RIGHT'):
    if side == 'RIGHT':
        vpart = n
        A0 = AL
        A1 = AR[:, :vpart]
        A2 = AR[:, vpart:]
    else:
        vpart = AL.shape[1] - n
        A0 = AL[:, :vpart]
        A1 = AL[:, vpart:]
        A2 = AR

    return A0, A1, A2


def repart_2x1_to_3x1(AT, \
                      AB, m=1, side='BOTTOM'):
    top_end      = AT.shape[0] if side == 'BOTTOM' else AT.shape[0] - m
    bottom_start = 0           if side == 'TOP'    else m

    A0 = AT[:top_end,      :]
    A2 = AB[bottom_start:, :]

    if side == 'BOTTOM':
        A1 = AB[:bottom_start, :]
    else:
        A1 = AT[top_end:, :]

    return A0, A1, A2


def repart_2x2_to_3x3(ATL, ATR, \
                      ABL, ABR,   m=1, n=1, quad='BR'):
    hpart = ATL.shape[0] - m if quad in ('TL', 'TR') else m
    vpart = ATL.shape[1] - n if quad in ('TL', 'BL') else n

    if quad == 'TL':
        A00, A01, A02 = ATL[:hpart, :vpart], ATL[:hpart, vpart:], ATR[:hpart, :]
        A10, A11, A12 = ATL[hpart:, :vpart], ATL[hpart:, vpart:], ATR[hpart:, :]
        A20, A21, A22 = ABL[:,      :vpart], ABL[:,      vpart:], ABR[:,      :]
    elif quad == 'TR':
        A00, A01, A02 = ATL[:hpart, :], ATR[:hpart, :vpart], ATR[:hpart, vpart:]
        A10, A11, A12 = ATL[hpart:, :], ATR[hpart:, :vpart], ATR[hpart:, vpart:]
        A20, A21, A22 = ABL[:,      :], ABR[:,      :vpart], ABR[:,      vpart:]
    elif quad == 'BL':
        A00, A01, A02 = ATL[:,      :vpart], ATL[:,      vpart:], ATR[:,      :]
        A10, A11, A12 = ABL[:hpart, :vpart], ABL[:hpart, vpart:], ABR[:hpart, :]
        A20, A21, A22 = ABL[hpart:, :vpart], ABL[hpart:, vpart:], ABR[hpart:, :]
    elif quad == 'BR':
        A00, A01, A02 = ATL[:,      :], ATR[:,      :vpart], ATR[:,      vpart:]
        A10, A11, A12 = ABL[:hpart, :], ABR[:hpart, :vpart], ABR[:hpart, vpart:]
        A20, A21, A22 = ABL[hpart:, :], ABR[hpart:, :vpart], ABR[hpart:, vpart:]

    return A00, A01, A02, \
           A10, A11, A12, \
           A20, A21, A22
