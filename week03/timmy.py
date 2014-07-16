from tkinter import *
from tkinter import ttk

#COLORS

dark_gray        = '#a9a9a9'
gainsboro        = '#dcdcdc'
lawn_green       = '#7cfc00'
light_blue       = '#add8e6'
light_gray       = '#d3d3d3'
light_green      = '#90ee90'
light_slate_gray = '#778899'
light_steel_blue = '#b0c4de'

#TUNEABLE PARAMETERS

AXIS_COLOR   = 'red'
GHOST_COLOR  = light_gray
GRID_COLOR   = gainsboro
TARGET_COLOR = light_blue
TARGET_WIDTH = 3
TIMMY_COLOR  = 'blue'

TARGETS = [[1, 1, 0, 1], \
           [0, -1, 1, 0], \
           [2, 0, 0, 2], \
           [-1, 0, 0, 1], \
           [0.4, 0, 0, 0.4], \
           [1, 0, 0, -1], \
           [-1, 0, 0, -1], \
           [1, 0, 1, 1], \
           [2, 0, 0, 0.5], \
           [-1.06, -1.06,  1.06, -1.06], \
           [2, 0, 3, -2]]

#END TUNEABLE PARAMETERS

assert len(TARGETS) > 0

canvas_width, canvas_height = 600, 600
#there is code that requires x_max == y_max
x_max, y_max = 10, 10
target_index = 0

def draw_ghost_timmy():    
    canvas.create_line(pc(0,    0  ), pc(1,    1  ), fill=GHOST_COLOR, tags='ghost')
    canvas.create_line(pc(2,    0  ), pc(1,    1  ), fill=GHOST_COLOR, tags='ghost')
    canvas.create_line(pc(1,    1  ), pc(1,    3  ), fill=GHOST_COLOR, tags='ghost')
    canvas.create_line(pc(0,    1.5), pc(2,    2.5), fill=GHOST_COLOR, tags='ghost')

    canvas.create_line(pc(0.25, 3  ), pc(1.75, 3  ), fill=GHOST_COLOR, tags='ghost')
    canvas.create_line(pc(1.75, 3  ), pc(1.75, 4.5), fill=GHOST_COLOR, tags='ghost')
    canvas.create_line(pc(1.75, 4.5), pc(0.25, 4.5), fill=GHOST_COLOR, tags='ghost')
    canvas.create_line(pc(0.25, 4.5), pc(0.25, 3  ), fill=GHOST_COLOR, tags='ghost')

#    canvas.tag_lower('ghost', 'target')

def draw_target_timmy():
    canvas.delete('target')

    a = TARGETS[target_index][0]
    b = TARGETS[target_index][1]
    c = TARGETS[target_index][2]
    d = TARGETS[target_index][3]

    #control points
    timmy0 = pc(             0,              0) #(0 0)
    timmy1 = pc(   2*a        ,    2*c        ) #(2 0)
    timmy2 = pc(     a +     b,      c +     d) #(1 1)
    timmy3 = pc(         1.5*b,          1.5*d) #(0 1.5)
    timmy4 = pc(   2*a + 2.5*b,    2*c + 2.5*d) #(2 2.5)
    timmy5 = pc(0.25*a +   3*b, 0.25*c +   3*d) #(0.25 3)
    timmy6 = pc(     a +   3*b,      c +   3*d) #(1 3)
    timmy7 = pc(1.75*a +   3*b, 1.75*c +   3*d) #(1.75 3)
    timmy8 = pc(0.25*a + 4.5*b, 0.25*c + 4.5*d) #(0.25, 4.5)
    timmy9 = pc(1.75*a + 4.5*b, 1.75*c + 4.5*d) #(1.75, 4.5)

    #body
    canvas.create_line(timmy0, timmy2, fill=TARGET_COLOR, tags='target', width=TARGET_WIDTH)
    canvas.create_line(timmy1, timmy2, fill=TARGET_COLOR, tags='target', width=TARGET_WIDTH)
    canvas.create_line(timmy2, timmy6, fill=TARGET_COLOR, tags='target', width=TARGET_WIDTH)
    canvas.create_line(timmy3, timmy4, fill=TARGET_COLOR, tags='target', width=TARGET_WIDTH)

    #head
    canvas.create_line(timmy5, timmy7, fill=TARGET_COLOR, tags='target', width=TARGET_WIDTH)
    canvas.create_line(timmy7, timmy9, fill=TARGET_COLOR, tags='target', width=TARGET_WIDTH)
    canvas.create_line(timmy9, timmy8, fill=TARGET_COLOR, tags='target', width=TARGET_WIDTH)
    canvas.create_line(timmy8, timmy5, fill=TARGET_COLOR, tags='target', width=TARGET_WIDTH)

#    canvas.tag_lower('target','timmy')

def draw_timmy(*args):
    canvas.delete('timmy')

    a = float(a00.get())
    b = float(a01.get())
    c = float(a10.get())
    d = float(a11.get())

    timmy0 = pc(             0,              0) #(0 0)
    timmy1 = pc(   2*a        ,    2*c        ) #(2 0)
    timmy2 = pc(     a +     b,      c +     d) #(1 1)
    timmy3 = pc(         1.5*b,          1.5*d) #(0 1.5)
    timmy4 = pc(   2*a + 2.5*b,    2*c + 2.5*d) #(2 2.5)
    timmy5 = pc(0.25*a +   3*b, 0.25*c +   3*d) #(0.25 3)
    timmy6 = pc(     a +   3*b,      c +   3*d) #(1 3)
    timmy7 = pc(1.75*a +   3*b, 1.75*c +   3*d) #(1.75 3)
    timmy8 = pc(0.25*a + 4.5*b, 0.25*c + 4.5*d) #(0.25, 4.5)
    timmy9 = pc(1.75*a + 4.5*b, 1.75*c + 4.5*d) #(1.75, 4.5)

    #body
    canvas.create_line(timmy0, timmy2, fill=TIMMY_COLOR, tags='timmy')
    canvas.create_line(timmy1, timmy2, fill=TIMMY_COLOR, tags='timmy')
    canvas.create_line(timmy2, timmy6, fill=TIMMY_COLOR, tags='timmy')
    canvas.create_line(timmy3, timmy4, fill=TIMMY_COLOR, tags='timmy')

    #head
    canvas.create_line(timmy5, timmy7, fill=TIMMY_COLOR, tags='timmy')
    canvas.create_line(timmy7, timmy9, fill=TIMMY_COLOR, tags='timmy')
    canvas.create_line(timmy9, timmy8, fill=TIMMY_COLOR, tags='timmy')
    canvas.create_line(timmy8, timmy5, fill=TIMMY_COLOR, tags='timmy')

    canvas.tag_lower('ghost', 'target')
    canvas.tag_lower('target','timmy')
 
def next_target():
    global target_index, TARGETS
    prev_button.state(['!disabled'])
    target_index += 1
    if target_index == len(TARGETS) - 1:
        next_button.state(['disabled'])
    reset_timmy()
    draw_target_timmy()

def next_target_wrapper(*args):
    global target_index, TARGETS
    if target_index == len(TARGETS) - 1 or target_state.get() == 0:
        return
    else:
        next_target()

#convert plot coordinates to canvas coordinates
def pc(x, y):
    canvas_x_unit = canvas_width  / (2 * x_max)
    canvas_y_unit = canvas_height / (2 * x_max)
    canvas_x_zero = x_max * canvas_x_unit
    canvas_y_zero = y_max * canvas_y_unit
    return (x * canvas_x_unit + canvas_x_zero, -y * canvas_y_unit + canvas_y_zero)

def prev_target():
    global target_index
    next_button.state(['!disabled'])
    target_index -= 1
    if target_index == 0:
        prev_button.state(['disabled'])
    reset_timmy()
    draw_target_timmy()

def prev_target_wrapper(*args):
    global target_index
    if target_index == 0 or target_state.get() == 0:
        return
    else:
        prev_target()

def reset_timmy():
    a00.set('1')
    a01.set('0')
    a10.set('0')
    a11.set('1')
    draw_timmy()

def surrender():
    a00.set(str(TARGETS[target_index][0]))
    a01.set(str(TARGETS[target_index][1]))
    a10.set(str(TARGETS[target_index][2]))
    a11.set(str(TARGETS[target_index][3]))
    draw_timmy()

def toggle_axes():
    if axes_state.get() == 0:
        canvas.itemconfigure('axis', state='hidden')
        canvas.itemconfigure('tick', state='hidden')
    else:
        canvas.itemconfigure('axis', state='normal')
        if tick_state.get() == 1:
            canvas.itemconfigure('tick', state='normal')

def toggle_ghost():
    if ghost_state.get() == 0:
        canvas.itemconfigure('ghost', state='hidden')
    else:
        canvas.itemconfigure('ghost', state='normal')

def toggle_grid():
    if grid_state.get() == 0:
        canvas.itemconfigure('grid', state='hidden')
    else:
        canvas.itemconfigure('grid', state='normal')

def toggle_target():
    if target_state.get() == 0:
        canvas.delete('target')
        prev_button.state(['disabled'])
        next_button.state(['disabled'])
        surrender_button.state(['disabled'])
    else:
        surrender_button.state(['!disabled'])
        if len(TARGETS) > 0:
            if target_index > 0:
                prev_button.state(['!disabled'])
            if target_index < len(TARGETS) - 1:
                next_button.state(['!disabled'])
        draw_target_timmy()

def toggle_ticks():
    if axes_state.get() == 1:
        if tick_state.get() == 0:
            canvas.itemconfigure('tick', state='hidden')
        else:
            canvas.itemconfigure('tick', state='normal')


root = Tk()
root.title("Timmy Two Space")

#matrix entries
a00 = StringVar()
a00.set("1")
a00_entry = ttk.Entry(root, textvariable=a00, width=5)
a00_entry.grid(row=0, column=0)

a01 = StringVar()
a01.set("0")
ttk.Entry(root, textvariable=a01, width=5).grid(row=0, column=1)

a10 = StringVar()
a10.set("0")
ttk.Entry(root, textvariable=a10, width=5).grid(row=1, column=0)

a11 = StringVar()
a11.set("1")
ttk.Entry(root, textvariable=a11, width=5).grid(row=1, column=1)

#top panel widgets
ttk.Button(root, text="Timmy!", command=draw_timmy).grid(row=0, column=2)
prev_button = ttk.Button(root, text='< Previous Target', command=prev_target, state='disabled')
prev_button.grid(row=0, column=3)
next_button = ttk.Button(root, text='Next Target >', command=next_target)
next_button.grid(row=0, column=4)
if len(TARGETS) == 1:
    next_button.state(['disabled'])

target_state = IntVar()
target_state.set(1)
ttk.Checkbutton(root, command=toggle_target, text='Targets', variable=target_state).grid(row=1, column=2)

ghost_state = IntVar()
ghost_state.set(1)
ttk.Checkbutton(root, command=toggle_ghost, text='Ghost', variable=ghost_state).grid(row=1, column=3)

#bottom panel widgets
grid_state = IntVar()
ttk.Checkbutton(root, command=toggle_grid, text='Grid', variable=grid_state).grid(row=3, column=1)

axes_state = IntVar()
axes_state.set(1)
ttk.Checkbutton(root, command=toggle_axes, text='Axes', variable=axes_state).grid(row=3, column=2)

tick_state = IntVar()
ttk.Checkbutton(root, command=toggle_ticks, text='Ticks', variable=tick_state).grid(row=3, column=3)

surrender_button = ttk.Button(root, text='Surrender', command=surrender)
surrender_button.grid(row=3, column=0)
ttk.Button(root, text="Quit", command=lambda: root.destroy()).grid(row=3, column=4)

#canvas
frame = Frame(root, borderwidth=3, relief='groove')
frame.grid(row=2, column=0, columnspan=5)

canvas = Canvas(frame, width=canvas_width, height=canvas_height, background='white')
canvas.grid()

#grid (this code assumes that x_max == y_max)
assert x_max == y_max
for i in range(-x_max, x_max + 1):
    canvas.create_line(pc(-x_max, i), pc(x_max, i), fill=GRID_COLOR, state='hidden', tags='grid')
    canvas.create_line(pc(i, -y_max), pc(i, y_max), fill=GRID_COLOR, state='hidden', tags='grid')

#axes
canvas.create_line(pc(-x_max, 0), pc(x_max, 0), arrow='last', fill=AXIS_COLOR, state='normal', tags='axis')
canvas.create_line(pc(0, -y_max), pc(0, y_max), arrow='last', fill=AXIS_COLOR, state='normal', tags='axis')

#ticks
for i in range(1 - x_max, x_max):
    canvas.create_line(pc(0, i), pc(0.2, i), fill=AXIS_COLOR, state='hidden', tags='tick')
    canvas.create_line(pc(i, 0), pc(i, 0.2), fill=AXIS_COLOR, state='hidden', tags='tick')

draw_ghost_timmy()
draw_target_timmy()
draw_timmy()

a00_entry.focus()
root.bind('<Control-Left>', prev_target_wrapper)
root.bind('<Control-Right>', next_target_wrapper)
root.bind('<Return>', draw_timmy)

root.mainloop()
