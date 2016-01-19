from django.shortcuts import render
from django.http import HttpResponse

from bokeh.models import Plot
from bokeh.embed import components
from bokeh.resources import Resources
from bokeh.plotting import figure, output_file, show


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



    output_file("plot.html")

    p = figure(plot_width=400, plot_height=400)
    # We add a square renderer with a size, color, and alpha
    p.square([1, 2, 3, 4, 5], [6, 7, 2, 4, 5], size=20, color="olive", alpha=0.5)

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
