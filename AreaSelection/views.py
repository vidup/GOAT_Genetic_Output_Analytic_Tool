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

#--- Pandas ---#
import pandas as pandas
import numpy as numpy

#--- Regex ---#
import re as regex

#--- Tools ---#
from Tools import connect
from Tools import getPhenotypes

#--- JSON ---#
import json

# Create your views here.

def getAreaSelectionData(position_min, position_max, chromosome, phenotype):
    #We query the database for the relevant snps around our selected position

    sqlQuery = "select distinct a.rs_id_assoc , a.chromosome,a.pos,a.info_assoc,a.pvalue_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB, a.cohort_AB, a.beta_assoc,a.maf, a.all_OR,xp.covariates,p.Risk_on_rise,dat.name from assoc a join experiment xp on a.experiment=xp.idexperiment join dataset dat on xp.dataset=dat.iddataset join phenotypes  p  on xp.phenotype=p.idphenotypes where p.nom='"+phenotype+"' and a.chromosome="+chromosome+" limit 1000000;"
    snps = connect.fetchData(sqlQuery)
    snps = snps[(snps['pos']>position_min) & (snps['pos']<position_max)]

    snps["risk_allele"] = numpy.where(\
                            numpy.logical_or(\
                                numpy.logical_and(snps['beta_assoc']>0, snps['Risk_on_rise']==1),\
                                numpy.logical_and(snps['beta_assoc']<0, snps['Risk_on_rise']==0)\
                            ),\
                            snps['allele_B'],\
                            snps['allele_A']\
                          )
    # snps["risk_allele"]=numpy.where((snps['beta_assoc'] > 0 & snps['Risk_on_rise']==1)|(snps['beta_assoc'] < 0 & snps['Risk_on_rise']==0), snps['allele_B'], snps['allele_A'])             # select risk allele
    snps["risk_af"] = numpy.where(\
                        numpy.logical_or(\
                            numpy.logical_and(snps['beta_assoc'] > 0,snps['Risk_on_rise']==1),\
                            numpy.logical_and(snps['beta_assoc'] < 0,snps['Risk_on_rise']==0)\
                        ),\
                        ((2*snps["cohort_BB"])+snps["cohort_AB"])/((2*snps["cohort_AA"])+(2*snps["cohort_AB"])+(2*snps["cohort_BB"])),\
                        ((2*snps["cohort_AA"])+snps["cohort_AB"])/((2*snps["cohort_AA"])+(2*snps["cohort_AB"])+(2*snps["cohort_BB"]))\
                      )
    # snps["risk_af"]=numpy.where((snps['beta_assoc'] > 0 & snps['Risk_on_rise']==1)|(snps['beta_assoc'] < 0 & snps['Risk_on_rise']==0), ((2*snps["cohort_BB"])+snps["cohort_AB"])/((2*snps["cohort_AA"])+(2*snps["cohort_AB"])+(2*snps["cohort_BB"])), ((2*snps["cohort_AA"])+snps["cohort_AB"])/((2*snps["cohort_AA"])+(2*snps["cohort_AB"])+(2*snps["cohort_BB"]))) #calculate allele frequency for each allele
    snps["risk_allele_beta"] = numpy.where(\
                        numpy.logical_or(\
                            numpy.logical_and(snps['beta_assoc'] > 0,snps['Risk_on_rise']==1),\
                            numpy.logical_and(snps['beta_assoc'] < 0,snps['Risk_on_rise']==0)\
                        ),\
                        snps['beta_assoc'],\
                        snps['beta_assoc']*-1\
                      )
    # snps["risk_allele_beta"]=numpy.where((snps['beta_assoc'] > 0 & snps['Risk_on_rise']==1)|(snps['beta_assoc'] < 0 & snps['Risk_on_rise']==0), snps['beta_assoc'], snps['beta_assoc']*-1)         #update beta according to risk allele result
    snps.rename(columns = {'nom' : 'rs_id_assoc'}, inplace=True)

    sqlQuery2 = ("select m.nom, m.gene, m.gene_before, m.gene_after, m.end_gen_after,m.end_gen,m.start_gen,m.end_gen_before,m.func,m.position,m.start_gen_after,m.start_gen_before, m.observed "
          +" from marqueurs m where m.chromosome="+chromosome+" and position between "+str(position_min)+" and "+str(position_max))
    lastSnps= connect.fetchData(sqlQuery2)
    lastSnps.rename(columns = {'nom':'rs_id_assoc'}, inplace=True)
    #We sort the dataframe by the snp's position
    lastSnps.sort_values(by="position")
    # print lastSnps
    # Then we create the Plot Title :
    title = "CHROMOSOME :"+str(chromosome)+" \nBETWEEN POSITIONS "+str(position_min)+" AND "+str(position_max)

    # Then we merge the two dataframes together.
    pandas.set_option('display.max_colwidth',-1)                        #important to make links appear in pandas dataframe
    snps = pandas.merge(snps,lastSnps,on='rs_id_assoc',how='outer')
    del snps["pos"]

    return snps

def generateAreaSelection(dataframe, userWidth, userHeight, position_min, position_max):
    snps = dataframe
    snps["log10"] = -numpy.log10(snps.pvalue_assoc)                     #transformation
    snps = snps.sort_values(by="pvalue_assoc")                                  # SORT BY P-VALUE
    max_pvalue = int(snps.log10[0:1])                                      # GET MINIMUM P-VALUE
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
                                    #NEW COLUMNS AND RENAMING
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    snps['imp'] = numpy.where(snps['info_assoc']==1, snps['log10'], 'NaN') # gather information on imputed snps
    snps['Imputed'] = numpy.where(snps['info_assoc']==1, True, False)            #discriminate between imputed and genotyped for table
    snps['interest'] = numpy.where(snps['log10']>=(-numpy.log10(0.00000005)), snps['log10'], 'NaN')  #select snp of interest

#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    source = ColumnDataSource(snps)                    # SOURCE DATA FOR BOKEH PLOT
    TOOLS = [HoverTool(
        tooltips=[
        ("SNP", "@rs_id_assoc"),
        ("Gene", "@gene"),
        ("P-value","@pvalue_assoc"),
        ("Region","@func")
        ]
    ), CrosshairTool(), WheelZoomTool(), BoxSelectTool(), BoxZoomTool(), ResizeTool(), ResetTool(), PanTool(), PreviewSaveTool(), TapTool()]

    stringLegend = "pvalue < "+str(0.001)
    plot = figure(
                webgl=True,
                tools=TOOLS,
                x_axis_label='Position',
                y_axis_label='-log10(p)',
                plot_width=userWidth,
                plot_height=userHeight,
                x_range=(position_min-150000,position_max+150000),
                y_range=(-3.2,max_pvalue+3)
                # y_range = (-1, max_pvalue+1)
            )
    plot.circle('position', 'log10', source=source, size=7, legend='Genotyped')
    plot.square('position', 'imp', source=source, size=7, color="olive", legend='Imputed')
    plot.circle('position', 'interest', source=source, size=7, color="red", legend=stringLegend)

    snps = snps.sort_values(by="position")                      # SORT POSITIONS
    snps.drop_duplicates(subset=('gene'), inplace=True, keep="last") # TAKE GENE NAME DUPLICATES OFF

    # for i in range(0,10):
    #     snps['ligne'+str(i+1)] = snps.start_gen[i:len(snps):10]
    #     snps['Fligne'+str(i+1)] = snps.end_gen[i:len(snps):10]
    #
    # positions = {
    #     'ligne1' : -0.30,
    #     'ligne2' : -0.55,
    #     'ligne3' : -0.85,
    #     'ligne4' : -1.15,
    #     'ligne5' : -2.95,
    #     'ligne6' : -2.65,
    #     'ligne7' : -2.35,
    #     'ligne8' : -2.05,
    #     'ligne9' : -1.75,
    #     'ligne10' : -1.45
    # }
    # for key, value in positions.items():
    #     print key, value
    #     plot.segment(snps[key], [value]*(len(snps)), snps['F'+key],[value]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 1
    #     # plot.text(snps[key]+((snps['F'+key]-snps[key])/2), [value-0.05]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    snps['ligne1'] = snps.start_gen[0:len(snps):10]
    snps['Fligne1'] =snps.end_gen[0:len(snps):10]

    snps['ligne2'] = snps.start_gen[1:len(snps):10]
    snps['Fligne2'] =snps.end_gen[1:len(snps):10]

    snps['ligne3'] = snps.start_gen[2:len(snps):10]
    snps['Fligne3'] =snps.end_gen[2:len(snps):10]

    snps['ligne4'] = snps.start_gen[3:len(snps):10]
    snps['Fligne4'] =snps.end_gen[3:len(snps):10]

    snps['ligne5'] = snps.start_gen[4:len(snps):10]
    snps['Fligne5'] =snps.end_gen[4:len(snps):10]

    snps['ligne6'] = snps.start_gen[5:len(snps):10]
    snps['Fligne6'] =snps.end_gen[5:len(snps):10]

    snps['ligne7'] = snps.start_gen[6:len(snps):10]
    snps['Fligne7'] =snps.end_gen[6:len(snps):10]

    snps['ligne8'] = snps.start_gen[7:len(snps):10]
    snps['Fligne8'] =snps.end_gen[7:len(snps):10]

    snps['ligne9'] = snps.start_gen[8:len(snps):10]
    snps['Fligne9'] =snps.end_gen[8:len(snps):10]

    snps['ligne10'] =snps.start_gen[9:len(snps):10]
    snps['Fligne10'] =snps.end_gen[9:len(snps):10]

    plot.segment(snps.ligne1, [-0.30]*(len(snps)), snps.Fligne1,[-0.30]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 1
    plot.text(snps.ligne1+((snps.Fligne1-snps.ligne1)/2), [-0.25]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.segment(snps.ligne2, [-0.55]*(len(snps)), snps.Fligne2,[-0.55]*(len(snps)), line_width=6, line_color="#8b4513",)           #ligne 2
    plot.text(snps.ligne2+((snps.Fligne2-snps.ligne2)/2), [-0.50]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.segment(snps.ligne3, [-0.85]*(len(snps)), snps.Fligne3,[-0.85]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 3
    plot.text(snps.ligne3+((snps.Fligne3-snps.ligne3)/2), [-0.80]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.segment(snps.ligne4, [-1.15]*(len(snps)), snps.Fligne4,[-1.15]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 4
    plot.text(snps.ligne4+((snps.Fligne4-snps.ligne4)/2), [-1.10]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.segment(snps.ligne10,[-1.45]*(len(snps)), snps.Fligne10,[-1.45]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 5
    plot.text(snps.ligne10+((snps.Fligne10-snps.ligne10)/2), [-1.40]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.segment(snps.ligne9, [-1.75]*(len(snps)), snps.Fligne9,[-1.75]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 6
    plot.text(snps.ligne9+((snps.Fligne9-snps.ligne9)/2), [-1.70]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.segment(snps.ligne8, [-2.05]*(len(snps)), snps.Fligne8, [-2.05]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 7
    plot.text(snps.ligne8+((snps.Fligne8-snps.ligne8)/2), [-2.00]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.segment(snps.ligne7,[-2.35]*(len(snps)), snps.Fligne7,[-2.35]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 8
    plot.text(snps.ligne7+((snps.Fligne7-snps.ligne7)/2), [-2.30]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.segment(snps.ligne6,[-2.65]*(len(snps)), snps.Fligne6,[-2.65]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 9
    plot.text(snps.ligne6+((snps.Fligne6-snps.ligne6)/2), [-2.60]*(len(snps)),text=snps.gene, text_color='black', text_align='center', text_font_size='1em',text_font_style='bold')

    plot.segment(snps.ligne5,[-2.95]*(len(snps)), snps.Fligne5,[-2.95]*(len(snps)), line_width=6, line_color="#8b4513",)          #ligne 10
    plot.text(snps.ligne5+((snps.Fligne5-snps.ligne5)/2), [-2.90]*(len(snps)), text=snps.gene, text_color='black', text_align='center', text_font_size='1em', text_font_style='bold')

    plot.grid.grid_line_color = None            # TAKE GRID LINES OFF THE GRAPH
    graph, div1 = components(plot, CDN)
    return graph, div1

def buildAreaSelectionData(data):
    data['Imputed'] = numpy.where(data['info_assoc']==1, True, False)    #discriminate between imputed and genotyped for graph

    data['dbSNP'] = ''
    data['GWAS_Catalog'] = ''
    data['Genecards'] = ''
    
    data = data.rename(columns = {'rs_id_assoc': 'rs_ID', 'position': 'Position', 'chromosome': 'Chr','func':'Region', 'gene_before': 'GeneBefore', 'pvalue_assoc': 'P-value', 'allele_A': 'Allele A', 'allele_B': 'Allele B', 'gene': 'Gene', 'name': 'Cohort', 'gene_after': 'GeneAfter'})  #rename column to make them look nicer
    data.sort_index(inplace=True)
    data["Allele\nmineure"] = numpy.where(data['cohort_AA'] > data['cohort_BB'], data['Allele B'], data['Allele A'])       #calculate minor allele then select it

    data = data[['rs_ID', 'Chr', 'Position', 'GeneBefore', 'Gene', 'GeneAfter', 'Region','P-value', 'Imputed', 'Allele A', 'Allele B', 'Allele\nmineure','risk_allele','risk_af','risk_allele_beta', 'Cohort', 'dbSNP', 'GWAS_Catalog', 'Genecards']]

    jsonData = data.to_json(orient='records')#json table
    return jsonData

# Area Selection
def areaSelection(request, chromosome, position, phenotype, userWidth, userHeight):
    print request, chromosome, position, phenotype

    #Temporary, we set the position here. Since it's ALWAYS THE F****** SAME, we'll store in directly in the database.
    chr_min_pos = [3010317, 1867651, 1669025, 1794188, 1506474, 240305, 5647989, 1759965, 275763, 1721856, 2866248, 1748766, 21526104, 21195777, 21157586, 1274718, 2275734, 3146519, 3571446, 923302, 15873783, 17575800]
    chr_max_pos = [246687278, 242117652, 197214763, 190720803, 180079230, 170230001, 154256063, 144059545, 138180042, 134060922, 131727426, 131648275, 113763278, 96015899, 98835618, 86480974, 79120092, 76663143, 54091666, 62716270, 42599240, 45940164]

    #Little correction on min and max position to center the view on the requested value.
    position_max = int(position)+ 1500000
    position_min = int(position)-1500000
    if position_min < chr_min_pos[int(chromosome)-1]:
        position_min = chr_min_pos[int(chromosome)-1]
        position_max = position_min+3000000
    if position_max > chr_max_pos[int(chromosome)-1]:
        position_max = chr_max_pos[int(chromosome)-1]
        position_min = position_max-3000000

    snps = getAreaSelectionData(position_min, position_max, chromosome, phenotype)

    jsonData = buildAreaSelectionData(snps)
    # print jsonData
    graphScript, div = generateAreaSelection(snps, int(userWidth), int(userHeight), position_min, position_max)

    snps = snps.to_json(orient='records')
    response = json.dumps({
            'div': str(div),
            'script': str(graphScript),
            'data' : jsonData
        },
        sort_keys=True,
        indent=4,
        separators=(',', ': ')
    )
    return HttpResponse(response)



def areaSelection2(chromosome,min_pos,max_pos,phenotype_select):
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    global threshold                                # GLOBAL VARIABLE ACESS
    global seuil
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    sql="select distinct a.rs_id_assoc , a.chromosome,a.pos,a.info_assoc,a.pvalue_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB,a.beta_assoc,a.maf, a.all_OR,xp.covariates,p.Risk_on_rise,dat.name from assoc a join experiment xp on a.experiment=xp.idexperiment join dataset dat on xp.dataset=dat.iddataset join phenotypes  p  on xp.phenotype=p.idphenotypes where p.nom='"+phenotype_select+"' and a.chromosome="+chromosome
    chrarea=pd.read_sql(sql,connection)
    #chrarea = s[s['chromosome'] == c]                      #SELECT CHROMOSOME
    area = chrarea[(chrarea['pos']>min) & (chrarea['pos']<max)]       #SELECT INTERVAL OF POSITIONS
    area["risk_allele"]=np.where((area['beta_assoc'] > 0 & area['Risk_on_rise']==1)|(area['beta_assoc'] < 0 & area['Risk_on_rise']==0), area['allele_B'], area['allele_A'])             # select risk allele
    area["risk_af"]=np.where((area['beta_assoc'] > 0 & area['Risk_on_rise']==1)|(area['beta_assoc'] < 0 & area['Risk_on_rise']==0), ((2*area["cohort_BB"])+area["cohort_AB"])/((2*area["cohort_AA"])+(2*area["cohort_AB"])+(2*area["cohort_BB"])), ((2*area["cohort_AA"])+area["cohort_AB"])/((2*area["cohort_AA"])+(2*area["cohort_AB"])+(2*area["cohort_BB"]))) #calculate allele frequency for each allele
    area["risk_allele_beta"]=np.where((area['beta_assoc'] > 0 & area['Risk_on_rise']==1)|(area['beta_assoc'] < 0 & area['Risk_on_rise']==0), area['beta_assoc'], area['beta_assoc']*-1)         #update beta according to risk allele result
    sql = "select m.nom,m._after,m.end_gen,m.start_gen,m.end_gen_before,m.func,m.position,m.start_gen_after,m.start_gen_before, m.observed  from marqueurs m where m.chromosome="+str(chromosome)+" and position between "+str(min_pos)+" and "+str(max_pos)
    df_hg19_gene = pd.read_sql(sql, connection)                               # SQL QUERY SAVED IN PANDAS DATAFRAME
    df_hg19_gene_mapping = df_hg19_gene.rename(columns = {'nom':'rs_id_assoc'})                   # RENAME COLUMN

    string_name = "CHROMOSOME :"+str(chromosome)+" \nBETWEEN POSITIONS "+str(min_pos)+" AND "+str(max_pos)                # TITLE FOR GRAPH
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    pd.set_option('display.max_colwidth',-1)                        #important to make links appear in pandas dataframe
    complete_data = pd.merge(area,df_hg19_gene_mapping,on='rs_id_assoc',how='outer')             # MERGE ALL DATAFRAME
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#

    del complete_data["pos"]
    sort_df = complete_data.sort(['position'])              #sort BY position
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
                                                        # CREATING TABLES COLUMNS IN ADDING INFORMATION
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#    pd.set_option('display.max_colwidth', -1)

    #sort_df.drop_duplicates(subset='rs_id_assoc', inplace=True,take_last=True)  # TAKE DUPLICATES OFF
    sort_df["log10"] = -np.log10(sort_df.pvalue_assoc)                     #transformation
    sort_df = sort_df.sort(['pvalue_assoc'])                                  # SORT BY P-VALUE
    max_pvalue = int(sort_df.log10[0:1])                                      # GET MINIMUM P-VALUE
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
                                    #NEW COLUMNS AND RENAMING
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    sort_df['imp'] = np.where(sort_df['info_assoc']==1, sort_df['log10'], 'NaN') # gather information on imputed snps
    sort_df['Imputed'] = np.where(sort_df['info_assoc']==1, True, False)            #discriminate between imputed and genotyped for table
    complete_data['Imputed'] = np.where(complete_data['info_assoc']==1, True, False)    #discriminate between imputed and genotyped for graph
    sort_df['interest'] = np.where(sort_df['log10']>=(-np.log10(0.00000005)), sort_df['log10'], 'NaN')  #select snp of interest

    complete_data['dbSNP'] = '<a href="http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs='+complete_data.rs_id_assoc+'"target="_blank">dbSNP</a>'
    complete_data['GWAS_Catalog'] = '<p><a href="http://www.genome.gov/gwastudies/index.cfm?snp='+complete_data.rs_id_assoc+'"target="_blank">By rsID</a></p><p><a href="http://www.genome.gov/gwastudies/index.cfm?gene='+complete_data['gene_before']+'"target="_blank">By gene before</a><p><a href="http://www.genome.gov/gwastudies/index.cfm?gene='+complete_data['gene']+'"target="_blank">By gene</a></p><p><a href="http://www.genome.gov/gwastudies/index.cfm?gene='+complete_data['gene_after']+'"target="_blank">By gene after</a>'
    complete_data['Genecards'] = '<p><a href="http://www.genecards.org/cgi-bin/carddisp.pl?gene='+complete_data['gene_before']+'"target="_blank">By gene before</a></p><p><a href="http://www.genecards.org/cgi-bin/carddisp.pl?gene='+complete_data['gene']+'"target="_blank">By gene</a></p><p><a href="http://www.genecards.org/cgi-bin/carddisp.pl?gene='+complete_data['gene_after']+'"target="_blank">By gene after</a>'

    complete_data = complete_data.rename(columns = {'rs_id_assoc': 'rs_ID', 'position': 'Position', 'chromosome': 'Chr','func':'Region', 'gene_before': 'GeneBefore', 'pvalue_assoc': 'P-value', 'allele_A': 'Allele A', 'allele_B': 'Allele B', 'gene': 'Gene', 'name': 'Cohort', 'gene_after': 'GeneAfter'})  #rename column to make them look nicer
    complete_data.sort_index(inplace=True)
    complete_data["Allele\nmineure"] = np.where(complete_data['cohort_AA'] > complete_data['cohort_BB'], complete_data['Allele B'], complete_data['Allele A'])       #calculate minor allele then select it

    DF = complete_data[['rs_ID', 'Chr', 'Position', 'GeneBefore', 'Gene', 'GeneAfter', 'Region','P-value', 'Imputed', 'Allele A', 'Allele B', 'Allele\nmineure','risk_allele','risk_af','risk_allele_beta', 'Cohort', 'dbSNP', 'GWAS_Catalog', 'Genecards']]
    #DF = complete_data[['rs_ID', 'Chr', 'Position', 'Gene before', 'Gene', 'Gene after', 'Region','P-value   ', 'Imputed', 'Allele A', 'Allele B', 'Allele\nmineure', 'Cohort', 'dbSNP', 'GWAS_Catalog', 'Genecards']]
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    #file = DF.to_csv("/Users/beatrizkanzki/PycharmProjects/GOAT_Genetic_Ouput_Analysis_Tool/static/GeneSelection.csv", cols=['rs_id_assoc','Chr','Position','Gene before','Gene','Gene after','Region','P-value','Allele A','Allele B','Allele\nmineure','Cohort']) #SELECT COLUMNS FOR CSV FILE
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    source = ColumnDataSource(sort_df)                    # SOURCE DATA FOR BOKEH PLOT
    TOOLS = [HoverTool(tooltips=[("SNP", "@rs_id_assoc"), ("Gene", "@gene"),("P-value","@pvalue_assoc"),("Region","@func")]), TapTool()]
    stringLegend = "pvalue < "+str(threshold)
    plot = figure(tools=["box_zoom", "box_select", "wheel_zoom", TOOLS[0], "crosshair", "reset", "save", TOOLS[1]] , x_axis_label='Position', y_axis_label='-log10(p)', plot_width=900, plot_height=500, y_range=(-3.2,max_pvalue+3))
    plot.circle('position', 'log10', source=source, size=3, legend='Genotyped')
    plot.square('position', 'imp', source=source, size=3, color="olive", legend='Imputed')
    plot.circle('position', 'interest', source=source, size=3, color="red", legend=stringLegend)


#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    #html_table = DF.to_html(index=False,escape=False)         # PUT TABLE IN HTML
    sort_df = sort_df.sort(['position'])                      # SORT POSITIONS
    sort_df.drop_duplicates(subset=('gene'), inplace=True,take_last=True) # TAKE GENE NAME DUPLICATES OFF


    jsontable = DF.to_json(orient='records')#json table
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
                            # GENE POSITION PLOTTING
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
    sort_df['ligne1'] = sort_df.start_gen[0:len(sort_df):10]
    sort_df['Fligne1'] = sort_df.end_gen[0:len(sort_df):10]

    sort_df['ligne2'] = sort_df.start_gen[1:len(sort_df):10]
    sort_df['Fligne2'] = sort_df.end_gen[1:len(sort_df):10]

    sort_df['ligne3'] = sort_df.start_gen[2:len(sort_df):10]
    sort_df['Fligne3'] = sort_df.end_gen[2:len(sort_df):10]

    sort_df['ligne4'] = sort_df.start_gen[3:len(sort_df):10]
    sort_df['Fligne4'] = sort_df.end_gen[3:len(sort_df):10]

    sort_df['ligne5'] = sort_df.start_gen[4:len(sort_df):10]
    sort_df['Fligne5'] = sort_df.end_gen[4:len(sort_df):10]

    sort_df['ligne6'] = sort_df.start_gen[5:len(sort_df):10]
    sort_df['Fligne6'] = sort_df.end_gen[5:len(sort_df):10]

    sort_df['ligne7'] = sort_df.start_gen[6:len(sort_df):10]
    sort_df['Fligne7'] = sort_df.end_gen[6:len(sort_df):10]

    sort_df['ligne8'] = sort_df.start_gen[7:len(sort_df):10]
    sort_df['Fligne8'] = sort_df.end_gen[7:len(sort_df):10]

    sort_df['ligne9'] = sort_df.start_gen[8:len(sort_df):10]
    sort_df['Fligne9'] = sort_df.end_gen[8:len(sort_df):10]

    sort_df['ligne10'] = sort_df.start_gen[9:len(sort_df):10]
    sort_df['Fligne10'] = sort_df.end_gen[9:len(sort_df):10]

    # for i in range(0:10):
    #     sort_df['ligne'+str(i+1)] = sort_df.start_gen[i:len(sort_df):10]
    #     sort_df['Fligne'+str(i+1)] = sort_df.end_gen[i:len(sort_df):10]

    # positions = {
    #     'ligne1' : -0.30,
    #     'ligne2' : -0.55,
    #     'ligne3' : -0.85,
    #     'ligne4' : -1.15,
    #     'ligne5' : -2.95,
    #     'ligne6' : -2.65,
    #     'ligne7' : -2.35,
    #     'ligne8' : -2.05,
    #     'ligne9' : -1.75,
    #     'ligne10' : -1.45
    # }
    #
    #
    # for key, value in positions.items():
    #     print key, value
    #     plot.segment(sort_df[key], [value]*(len(sort_df)), sort_df['F'+key],[value]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 1
    #     plot.text(sort_df[key]+((sort_df['F'+key]-sort_df[key])/2), [value-0.05]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne1, [-0.30]*(len(sort_df)), sort_df.Fligne1,[-0.30]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 1
    plot.text(sort_df.ligne1+((sort_df.Fligne1-sort_df.ligne1)/2), [-0.25]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne2, [-0.55]*(len(sort_df)), sort_df.Fligne2,[-0.55]*(len(sort_df)), line_width=6, line_color="#8b4513",)           #ligne 2
    plot.text(sort_df.ligne2+((sort_df.Fligne2-sort_df.ligne2)/2), [-0.50]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne3, [-0.85]*(len(sort_df)), sort_df.Fligne3,[-0.85]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 3
    plot.text(sort_df.ligne3+((sort_df.Fligne3-sort_df.ligne3)/2), [-0.80]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne4, [-1.15]*(len(sort_df)), sort_df.Fligne4,[-1.15]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 4
    plot.text(sort_df.ligne4+((sort_df.Fligne4-sort_df.ligne4)/2), [-1.10]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne10,[-1.45]*(len(sort_df)), sort_df.Fligne10,[-1.45]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 5
    plot.text(sort_df.ligne10+((sort_df.Fligne10-sort_df.ligne10)/2), [-1.40]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne9, [-1.75]*(len(sort_df)), sort_df.Fligne9,[-1.75]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 6
    plot.text(sort_df.ligne9+((sort_df.Fligne9-sort_df.ligne9)/2), [-1.70]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne8, [-2.05]*(len(sort_df)), sort_df.Fligne8, [-2.05]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 7
    plot.text(sort_df.ligne8+((sort_df.Fligne8-sort_df.ligne8)/2), [-2.00]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne7,[-2.35]*(len(sort_df)), sort_df.Fligne7,[-2.35]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 8
    plot.text(sort_df.ligne7+((sort_df.Fligne7-sort_df.ligne7)/2), [-2.30]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.segment(sort_df.ligne6,[-2.65]*(len(sort_df)), sort_df.Fligne6,[-2.65]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 9
    plot.text(sort_df.ligne6+((sort_df.Fligne6-sort_df.ligne6)/2), [-2.60]*(len(sort_df)),text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt',text_font_style='bold')

    plot.segment(sort_df.ligne5,[-2.95]*(len(sort_df)), sort_df.Fligne5,[-2.95]*(len(sort_df)), line_width=6, line_color="#8b4513",)          #ligne 10
    plot.text(sort_df.ligne5+((sort_df.Fligne5-sort_df.ligne5)/2), [-2.90]*(len(sort_df)), text=sort_df.gene, text_color='black', text_align='center', text_font_size='5pt', text_font_style='bold')

    plot.grid.grid_line_color = None            # TAKE GRID LINES OFF THE GRAPH
    graph, div1 = components(plot, CDN)
    return graph, div1, jsontable,string_name
    #return render(request,'modules/areaSelection.html',{'username':request.user,'phenotype':phenotype_selected,'pheno': phenotypes_found, 'json':sorted_sorted_data_json})
