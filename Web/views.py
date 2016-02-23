#---- Django tools for connection ----#
from django.db import connection # To connect to the database

#---- Responses ----#
from django.http import HttpResponse # To send an http response to the client
from django.http import JsonResponse # To send JSON formated data to the client
from django.shortcuts import render
import json

#--- Pandas ---#
import pandas as pandas
import numpy as numpy
import pandas.io.sql as psql


# - - - - - - - - - - - - - - - - - - - - - - - - - - - Variables - - - - - - - - - - - - - - - - - - - - - - - - - -  #

# THIS IS TEMPORARY. WILL BE REPLACED BY A SESSION SYSTEM AND USER.PY INSTANCES IN WHICH WE'LL STORE THIS DATA
global data
# - - - - - - - - - - - - - - - - - - - - - - - - - - - Functions - - - - - - - - - - - - - - - - - - - - - - - - - -  #

# Returns a dataframe containing the data returned b the SQL Query
def fetchData(sqlQuery):
    return pandas.read_sql(sqlQuery, connection)

# Return one or several phenotypes significant with the input
def getSignigicantPhenotypes(type, value):
    phenotypes = pandas.DataFrame()

    # First we check the type of the input (rsID, Gene or Phenotype) and act accordingly

    treshold = "0.001"

    if type == "rsID":
        phenotypes = fetchData("select p.nom From marqueurs m join assoc a on a.rs_id_assoc = m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where pvalue_assoc <"+treshold+" and m.nom in ('"+value+"') order by a.pvalue_assoc ASC")
    elif type == "gene":
        phenotypes = fetchData("select DISTINCT p.nom From marqueurs m join assoc a on a.rs_id_assoc = m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where pvalue_assoc <"+treshold+" and (m.gene in ('"+value+"') or m.gene_before in ('"+value+"') or m.gene_after in ('"+value+"') ) order by a.pvalue_assoc ASC ")
    else:
        phenotypes = value

    return phenotypes

# - - - - - - - - - - - - - - - - - - - - - - - - - - - Views - - - - - - - - - - - - - - - - - - - - - - - - - - - -  #

# Index View
def index(request):
    print request
    return render(request, 'index.html')

# Login
def login(request):
    print request
    return HttpResponse('Login')


# HTML Table & Static Manhattan file
def table(request, type, value):
    print request, type, value
    global data

    # We'll need to get which phenotypes are selected.
    significantPhenotypes = getSignigicantPhenotypes(type, value)
    if significantPhenotypes.any()['nom']: # Check if there are significant phenotypes
        phenotype_selected = getSignigicantPhenotypes(type, value).iat[0,0] #This gets the name of the significant phenotype

        # First we define the query
        sqlQuery = "select distinct a.rs_id_assoc,a.chromosome,a.pos,a.pvalue_assoc,m.gene_before,m.gene,m.gene_after,a.experiment,a.info_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB,a.beta_assoc,a.maf,a.all_OR,xp.covariates, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.allele_B when a.beta_assoc<0 and p.Risk_on_rise is true then a.allele_A when a.beta_assoc>0 and p.Risk_on_rise is false then a.allele_A when a.beta_assoc<0 and p.Risk_on_rise is false then a.allele_B end as risk_allele, case when a.beta_assoc>0 and p.Risk_on_rise is true then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is true then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc>0 and p.Risk_on_rise is false then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is false then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) end as risk_af, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.beta_assoc when a.beta_assoc<0 and p.Risk_on_rise is true then a.beta_assoc*(-1) when a.beta_assoc>0 and p.Risk_on_rise is false then a.beta_assoc*(-1) when a.beta_assoc<0 and p.Risk_on_rise is false then a.beta_assoc end as risk_allele_beta from assoc a join experiment xp on a.experiment=xp.idexperiment join phenotypes  p  on xp.phenotype=p.idphenotypes join marqueurs m on a.rs_id_assoc=m.nom where p.nom='"+phenotype_selected+"' and a.pvalue_assoc<0.001"

        # Then we fetch the data and store it in a dataframe
        dataframe = fetchData(sqlQuery)
        dataframe.rename(columns={'rs_id_assoc':'rs id assoc'})  #Self-explanatory
        data = dataframe
        # Then we pass the dataframe to the client with json format
        return HttpResponse(dataframe.to_json(orient='records'))
    else:
        print "There is no phenotype !"
        return HttpResponse("There is no phenotype !")

def table_csv(request, rsID):
    print request
    global data
    # We'll need to get which phenotypes are selected.
    phenotype_selected = 'All cause death'

    # # First we define the query
    # sqlQuery = "select distinct a.rs_id_assoc,a.chromosome,a.pos,a.pvalue_assoc,m.gene_before,m.gene,m.gene_after,a.experiment,a.info_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB,a.beta_assoc,a.maf,a.all_OR,xp.covariates, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.allele_B when a.beta_assoc<0 and p.Risk_on_rise is true then a.allele_A when a.beta_assoc>0 and p.Risk_on_rise is false then a.allele_A when a.beta_assoc<0 and p.Risk_on_rise is false then a.allele_B end as risk_allele, case when a.beta_assoc>0 and p.Risk_on_rise is true then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is true then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc>0 and p.Risk_on_rise is false then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is false then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) end as risk_af, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.beta_assoc when a.beta_assoc<0 and p.Risk_on_rise is true then a.beta_assoc*(-1) when a.beta_assoc>0 and p.Risk_on_rise is false then a.beta_assoc*(-1) when a.beta_assoc<0 and p.Risk_on_rise is false then a.beta_assoc end as risk_allele_beta from assoc a join experiment xp on a.experiment=xp.idexperiment join phenotypes  p  on xp.phenotype=p.idphenotypes join marqueurs m on a.rs_id_assoc=m.nom where p.nom='"+phenotype_selected+"' and a.pvalue_assoc<0.001"
    #
    # # Then we fetch the data and store it in a dataframe
    # dataframe = fetchData(sqlQuery)
    # dataframe.rename(columns = {'nom':'rs_id_assoc'}) # Self-explanatory

    # We specify which columns we want to see displayed
    header = ["rs id assoc","chromosome","pos","pvalue assoc","gene before","gene","gene after","experiment","info assoc","allele A","allele B","cohort AA","cohort BB","beta assoc","maf","all OR","covariates","risk allele","risk af","risk allele beta"]
    # We set the HttpResponse to send our data in .csv format
    response = HttpResponse(data.to_csv(columns=header, index=False), content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename=relevant_snps.csv' # Next : Add userName at the end to allow multiple users at the same time
    return response

# Logout
def logout(request):
    print request
    return HttpResponse('Logout')

