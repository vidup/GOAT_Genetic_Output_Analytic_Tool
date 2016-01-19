from django.shortcuts import render
from django.http import HttpResponse

from bokeh.models import Plot
from bokeh.embed import components
from bokeh.resources import Resources
from bokeh.plotting import figure, output_file, show, ColumnDataSource
from bokeh.models import HoverTool, BoxSelectTool, BoxZoomTool, CrosshairTool, WheelZoomTool, ResizeTool, ResetTool, PanTool, PreviewSaveTool

from bokeh.models.widgets import DataTable, DateFormatter, TableColumn

# For testing purpose
from random import *
from math import *


# Area Selection
def areaSelection(request):
    print request
    # First we create the Plot
    # plot = Plot()
    # plot.add_glyph()
    # plot.add_layout()
    # plot.add_tools()

    # Then we create the corresponding script and div to send to the browser
    # embed_script, embed_div = components(plot, resources=Resources())


    # Shows in which template we want to display the file
    output_file("plot.html")

    # First we fetch our data (here we create it to simulate)
    x_coordinates = []
    y_coordinates = []

    dataSource = ColumnDataSource(
        data=dict(
            x=x_coordinates,
            y=y_coordinates,
        )
    )

    for x in range(0, 20000):
        x_coordinates.append(int(15000 * random()))
        y_coordinates.append(int(15000 * random()))

    # Then we set what tools we want for the plot (Hover, select, pan, wheel-zoom, etc.)
    # TOOLS = 'box_zoom,box_select,crosshair,wheel_zoom,resize,reset,hover'
    tools = [HoverTool(
        tooltips=[
            ("index", "$index"),
            ("(x,y)", "($x, $y)"),
        ]
    ), BoxSelectTool(), BoxZoomTool(), CrosshairTool(), WheelZoomTool(), ResizeTool(), ResetTool(), PanTool(), PreviewSaveTool()]

    # Then we create the plot
    p = figure(plot_width=1500, plot_height=800, title="Test Plot with Bokeh", tools=tools)

    # Then we start drawing on it
    p.circle('x', 'y', size=4, color="black", alpha=1, source=dataSource)

    # p.square([1, 2, 3, 4, 5], [6, 7, 2, 4, 5], size=20, color="olive", alpha=0.5)

    # show(p) #shows locally the result

    # We create two objects : the script and the HTML <div>.
    # They'll be sent in the template so that front-end BokehJS can display the data
    embed_script, embed_div = components(p, resources=Resources())

    return render(request, 'plot.html', {'embed_div': embed_div, 'embed_script': embed_script})

    # return HttpResponse('Area Selection Bokeh interactive Plot')


# Manhattan interactive plot
def manhattan(request):
    print request
    return HttpResponse('Interactive Manhattan')
