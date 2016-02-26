from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection # Used to connect with the database

#--- Bokeh ---#
from bokeh.models import Plot
from bokeh.embed import components
from bokeh.resources import Resources
from bokeh.plotting import figure, output_file, show, ColumnDataSource
from bokeh.models import TapTool, HoverTool, BoxSelectTool, BoxZoomTool, CrosshairTool, WheelZoomTool, ResizeTool, ResetTool, PanTool, PreviewSaveTool
from bokeh.resources import CDN

from bokeh.models.widgets import DataTable, DateFormatter, TableColumn

#--- Pandas ---#
import pandas as pandas
import numpy as numpy

#--- Regex ---#
import re as regex

# For testing purpose
from random import *
from math import *

#--- Tools ---#
from Tools import connect
from Tools import getPhenotypes

#--- Global variables until session system is in place ---#
global manhattanDiv

# - - - - - - - - - - - - - - - - - - - - - - - - - - - Views - - - - - - - - - - - - - - - - - - - - - - - - - - - -  #

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
def manhattan(request, type, value, x, y):
    global manhattanDiv
    print request
    # print "x : "+x
    # print "y : "+y
    # Here, add user's phenotypes
    data = getManhattanData(type, value)
    # print data
    graph, div = generateManhattan(data, "0.001", int(x), int(y))
    # print graph
    # print div
    manhattanDiv = div #For now we set it in a global variable. Next it will be on a user database.
    responseData = graph
    return HttpResponse(responseData)

def getManhattanDiv(request):
    print request
    global manhattanDiv
    # print "Here in getManhattanDiv function, in 'manhattan/div' route. The div value is : "
    # print manhattanDiv
    return HttpResponse(manhattanDiv)

def getManhattanData(type, value):

    # We'll need to get which phenotypes are selected.
    significantPhenotypes = getPhenotypes.getSignigicantPhenotypes(type, value)
    if significantPhenotypes.any()['nom']: # Check if there are significant phenotypes
        phenotype = getPhenotypes.getSignigicantPhenotypes(type, value).iat[0,0] #This gets the name of the significant phenotype
        # phenotype = "All cause death"
        # First we define the query
        sqlQuery="select distinct a.rs_id_assoc, a.chromosome,a.pos,a.info_assoc,a.pvalue_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB,a.beta_assoc,a.maf, a.all_OR,xp.covariates,m.gene,m.gene_before,m.gene_after from assoc a join experiment xp on a.experiment=xp.idexperiment join phenotypes  p  on xp.phenotype=p.idphenotypes join marqueurs m on a.rs_id_assoc=m.nom where p.nom='"+phenotype+"' and a.pvalue_assoc<=0.001"

        # Then we fetch the data and store it in a dataframe
        sorted_data = connect.fetchData(sqlQuery)

        sorted_data.drop_duplicates(subset='rs_id_assoc', inplace=True,keep='last')
        sorted_data["log10"] = -numpy.log10(sorted_data.pvalue_assoc)               #ADD COLUMN LOG10
        sorted_data = sorted_data.sort(['chromosome', 'pos'])
        sorted_data['even']=numpy.where(sorted_data['chromosome'] %2==0,sorted_data['log10'] , 'NaN')
        sorted_data["odd"]=numpy.where(sorted_data['chromosome'] %2!=0,sorted_data['log10'] , 'NaN')
        col=['rs_id_assoc', 'chromosome', 'pos', 'pvalue_assoc', 'allele_A', 'allele_B', 'covariates', 'cohort_BB', 'cohort_AA', 'beta_assoc', 'maf']
        return sorted_data

    else:
        print "There is no phenotype !"
        return "No Phenotype !"

def generateManhattan( manhattanData, treshold, userWidth, userHeight):
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    global chr_max_pos
    global chr_min_pos                          #GLOBAL variables call
    max_v=int(manhattanData.log10.max())
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    df_slice_dataframe = manhattanData.groupby('chromosome')                                    # CUTS GWAS DATA TO COMPUTE GWAS'S POSITIONS
    counter = 0
    dictionary_of_slices = {}               # put slices of dataframe in a dictionnary for reforming whole dataframe
    chr_max_pos=[]                          # get maximum position to get middle after
    chr_min_pos=[]                          # get minimum positions to get middle after
    manhattan_max_pos = [0]                 # get maximum position for each chromosome for manhattan plotting
    df_concat_slice=[]
    for name, group in df_slice_dataframe:
        dictionary_of_slices[str(name)] = group
        chr_min_pos.append(int(dictionary_of_slices[str(name)]['pos'][0:1]))                                #position min chromosome
        manhattan_max_pos.append(int(dictionary_of_slices[str(name)]['pos'][len(dictionary_of_slices[str(name)]['pos']) - 1:len(dictionary_of_slices[str(name)]['pos'])]) + manhattan_max_pos[counter])
        chr_max_pos.append(int(dictionary_of_slices[str(name)]['pos'][len(dictionary_of_slices[str(name)]['pos']) - 1:len(dictionary_of_slices[str(name)]['pos'])]))              #position max chromosome
        dictionary_of_slices[str(name)]['position']=group['pos'] + manhattan_max_pos[counter]
        counter += 1
        df_concat_slice.append(dictionary_of_slices[str(name)])
    counter = 0             #
    full_data=pandas.concat(df_concat_slice)                #recreate original manhattan data with position column added
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    milieu = []                                                                  # HALF OF CHROMOSOME POSITIONS TO STORE name of chromosomes

    for n in range(1,len(manhattan_max_pos)):
        milieu.append(manhattan_max_pos[n-1] + ((manhattan_max_pos[n]-manhattan_max_pos[n-1])//2))
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
                                # CREATE MANHATTAN PLOT
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    source = ColumnDataSource(full_data)                    # SOURCE DATA FOR BOKEH PLOT
    TOOLS = [HoverTool(
        tooltips=[
            ("SNP", "@rs_id_assoc"),
            ("Gene", "@gene"),
            ("P-value","@pvalue_assoc"),
        ]
    ), CrosshairTool(), WheelZoomTool(), ResizeTool(), ResetTool(), PanTool(), PreviewSaveTool(), TapTool()]
#  BoxSelectTool(), BoxZoomTool(),
    plot = figure(
        title="Manhattan Plot",
        tools=TOOLS,
        x_axis_label='Chromosomes',
        y_axis_label='-log10(p)',
        plot_width=userWidth,
        plot_height=userHeight,
        y_range=(2.0,max_v+3),
    )

    #This is for "odd" chromosomes
    plot.circle(
            'position',
            'odd',
            source=source,
            size=3
    )
    #This is for "even" chromosomes
    plot.circle(
            'position',
            'even',
            source=source,
            size=3,
            color="black"
    )
    plot.ray(x=[0],y=[treshold],length=0,angle=0, color='red')
    plot.ray(x=[0],y=[treshold],length=0, angle=numpy.pi,color='red')
    plot.axis.major_label_text_font_size='0pt'
    plot.text(milieu, [2.75]*(len(milieu)), text=["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"], text_color='black', text_align='center', text_font_size='8pt', text_font_style='bold')
    plot.text(milieu[(len(milieu)/2)-4],[2.25],text=["Chromosomes"], text_color='black', text_align='center', text_font_size='10pt', text_font_style='bold')
    plot.xaxis.major_tick_line_color = None
    plot.xaxis.minor_tick_line_color = None
    plot.xaxis.visible=None
    plot.grid.grid_line_color = None            # TAKE GRID LINES OFF THE GRAPH
    graph, div1 = components(plot, CDN)
    return graph, div1
