from numpy import random
from numpy import matrix

from sympy import init_printing, Matrix, MatMul, latex, Rational, zeros
from IPython.display import Math


class Problem():
	def __init__(self):

		m = self.random_integer( 3, 4 )
		n = self.random_integer( 2, 3 )
		
		tag = ''

		A = self.random_integer_matrix( m, n )
		x = self.random_integer_matrix( n, 1 )

		answer = A * x

	def random_integer( self, lo, hi ):
		x = random.rand()
		rand_int = int(round( (hi - lo) * x ) + lo)

		return rand_int

	def random_integer_matrix( self, m, n ):
		A = zeros( (m, n) )

		for i in range( m ):
			for j in range( n ):
				A[ i,j ] = Rational(self.random_integer( -4, 4 ))
		return A

	def __choose_problem_type__(self):
	
		m = self.random_integer( 2, 4 )
		k = self.random_integer( 2, 4 )
		n = self.random_integer( 2, 4 )
		tag = ' Matrix Matrix Multiplcation'
		
		case = self.random_integer( 1, 8 )
		
		#Scalar Multiplication
		if case is 1:
			m = 1
			k = 1
			n = 1
			tag = ' Scalar Multiplication'
			
		#Scal
		elif case is 2:
			n = 1
			k = 1
			tag = ' SCAL'
			
		#Scal
		elif case is 3:
			m = 1
			k = 1
			tag = ' SCAL'
		
		#Dot Product
		elif case is 4:
			m = 1
			n = 1
			tag = ' DOT'
			
		#Outer Product Product
		elif case is 5:
			k = 1
			#The 'n ' is to make proper grammar when displaying
			tag = 'n Outer Product' 
			
		#Matrix-Vector Product
		elif case is 6:
			n = 1
			tag = ' Matrix-Vector Product'
			
		#Row Vector-Matrix Product
		elif case is 7:
			m = 1
			tag = ' Row Vector-Matrix Product'
			
		return m, n, k, tag
		
	def new_problem(self):
		init_printing()

		m = self.random_integer( 3, 4 )
		n = self.random_integer( 2, 3 )

		self.A = self.random_integer_matrix( m, n )
		self.x = self.random_integer_matrix( n, 1 )
		self.answer = self.A * self.x

		return Math( "$$" + latex( MatMul( self.A, self.x ), mat_str = "matrix" ) + "=" + "?" + "$$" )
	
	def new_MM(self):
		init_printing()
		
		m, n, k, self.tag = self.__choose_problem_type__()
		
		self.A = self.random_integer_matrix( m, k )
		self.x = self.random_integer_matrix( k, n )
		self.answer = self.A * self.x
		
		return Math( "$$" + latex( MatMul( self.A, self.x ), mat_str = "matrix" ) + "=" + "?" + "$$" )

	def show_answer(self):
		init_printing()

		return Math( "$$" + latex( MatMul( self.A, self.x ), mat_str = "matrix" ) + "=" + latex( self.answer, mat_str = "matrix" ) + "$$")
		
	def show_problem_type(self):
		print( "This is a" + self.tag + " problem" )