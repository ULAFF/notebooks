'''
Usage: 
	python im_approx.py
	python im_approx.py <k>
	python im_approx.py <filename> <k>
	k is an optional command line argument, default is 20
'''

import sys
import numpy as np
import matplotlib.image as mpimg
import matplotlib.pyplot as plt

def read_image( filename ):
	'''
	Inputs:
		filename: location of the image file to use. png is preferred
	Outputs:
		A numpy ndarray containing the values at the pixels. 
			Can be either 2d or 3d depending on number of channels in the image

	Read the image into a numpy array, 
	note that it will scale all values to 
	be floats between 0..1
	'''
	return mpimg.imread( filename )

def make_normalApprox( img, k=20 ):
	( m, n ) = img.shape
	inc = np.floor( n/k ) #Python2.7 uses integer division, 3.3 needs floor function
	A = np.matrix( img[ :, ::inc ] )

	#Now create a projector onto the range of A
	try:
		X = np.linalg.solve( ( np.transpose( A ) * A ), np.transpose( A ) * img )
		normalApprox = A * X
	except:
		X = np.linalg.lstsq( ( np.transpose( A ) * A ), np.transpose( A ) * img )
		normalApprox = A * X[0]

	
	return normalApprox

def make_SVDApprox( img, k=20 ):
	'''
	Create an approximation of the image from the first k columns of the SVD
		np.linalg.svd returns U as expected
		np.linalg.svd returns Sigma as a vector of the singular values
		np.linalg.svd returns V as V^H... weird
	'''
	(U, Sigma, V) = np.linalg.svd( img )
	UL = U[ :, :k ]
	VL = V[ :k, : ]
	SigmaTL = np.matrix( np.diag( Sigma[ :k ] ) )

	SVDApprox = UL * SigmaTL * VL
	return SVDApprox

def create_approximations( img, k=20, approximator=make_normalApprox ):
	'''
	Inputs:
		img: a numpy matrix containing the pixel values
		k: number of columns to use.
	Outputs:
		normalApprox: The normal equation approximation to the image with 20 evenly spaced columns
		SVDApprox: The SVD approximation using the first 20 columns
	'''

	#See if it is a grayscale image or a color image
	try:
		( m, n ) = img.shape
	except( ValueError ):
		( m, n, l ) = img.shape
		normalApprox = np.zeros( ( m,n,l ) )
		SVDApprox = np.zeros( ( m,n,l ) )
		for i in range( l ):
			singleChannelImg = img[:,:,i]
			normalApprox[:,:,i], SVDApprox[:,:,i] = create_approximations( singleChannelImg, k, approximator )
		return normalApprox, SVDApprox

	normalApprox = approximator( img, k )
	SVDApprox = make_SVDApprox( img, k )

	return normalApprox, SVDApprox

def plot_approximations( img, normalApprox, SVDApprox, k=20 ):
	#Set up the plots and axes containers
	fig = plt.figure()
	fig.suptitle( 'k = %d' % k )

	axImg = fig.add_subplot(2,2,1)
	axImg.set_title( 'Original Image' )
	axImg.xaxis.set_visible( False )
	axImg.yaxis.set_visible( False )

	axNormal = fig.add_subplot( 2,2,3 )
	axNormal.set_title( 'Normal Approximation' )
	axNormal.xaxis.set_visible( False )
	axNormal.yaxis.set_visible( False )

	axSVD = fig.add_subplot(2,2,4)
	axSVD.set_title( 'SVD Approximation' )
	axSVD.xaxis.set_visible( False )
	axSVD.yaxis.set_visible( False )

	if( len( normalApprox.shape ) == 2 ):
		axImg.imshow( img, cmap='gray' )
		axNormal.imshow( normalApprox, cmap='gray' ) #Plot it
		axSVD.imshow( SVDApprox, cmap='gray' ) #Plot it
	else:
		axImg.imshow( img )
		axNormal.imshow( normalApprox )
		axSVD.imshow( SVDApprox )

	plt.show()

if __name__ == '__main__':
	filename = 'lenna.png'
	numCols  = 20
	if ( len( sys.argv ) == 3 ):
		filename = sys.argv[1]
		numCols  = int( sys.argv[2] )
	elif( len( sys.argv ) == 2 ):
		numCols = int( sys.argv[1] )

	img = read_image( filename )
	normalApprox, SVDApprox = create_approximations( img, k=numCols )
	plot_approximations( normalApprox, SVDApprox, k=numCols )