#---- Django tools for connection ----#
from django.db import connection # To connect to the database

#---- Ajax Responses ----#
from django.http import HttpResponse # To send an http response to the client
from django.http import JsonResponse # To send JSON formated data to the client
import json

#--- Pandas ---#
import pandas as pandas
import pandas.io.sql as psql
import numpy as np

# - - - - - - - - - - - - - - - - - - - - - - - - - - - Functions - - - - - - - - - - - - - - - - - - - - - - - - - -  #

# Returns a dataframe containing the data returned b the SQL Query
def fetchData(sqlQuery):
    return pandas.read_sql(sqlQuery, connection)

# - - - - - - - - - - - - - - - - - - - - - - - - - - - Views - - - - - - - - - - - - - - - - - - - - - - - - - - - -  #

# Index View
def index(request):
    print request
    return HttpResponse('Index Page')

# Login
def login(request):
    print request
    return HttpResponse('Login')

# HTML Table & Static Manhattan file
def table(request):
    print request
     # We'll need to get which phenotypes are selected.
    phenotype_selected = 'All cause death'

    # First we define the query
    sqlQuery="select distinct a.rs_id_assoc ,a.experiment, a.chromosome,a.pos,a.info_assoc,a.pvalue_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB,a.beta_assoc,a.maf, a.all_OR,xp.covariates,m.gene,m.gene_before,m.gene_after, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.allele_B when a.beta_assoc<0 and p.Risk_on_rise is true then a.allele_A when a.beta_assoc>0 and p.Risk_on_rise is false then a.allele_A when a.beta_assoc<0 and p.Risk_on_rise is false then a.allele_B end as risk_allele, case when a.beta_assoc>0 and p.Risk_on_rise is true then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is true then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc>0 and p.Risk_on_rise is false then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is false then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) end as risk_af, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.beta_assoc when a.beta_assoc<0 and p.Risk_on_rise is true then a.beta_assoc*(-1) when a.beta_assoc>0 and p.Risk_on_rise is false then a.beta_assoc*(-1) when a.beta_assoc<0 and p.Risk_on_rise is false then a.beta_assoc end as risk_allele_beta from assoc a join experiment xp on a.experiment=xp.idexperiment join phenotypes  p  on xp.phenotype=p.idphenotypes join marqueurs m on a.rs_id_assoc=m.nom where p.nom='"+phenotype_selected+"' and a.pvalue_assoc<0.001"

    # Then we fetch the data and store it in a dataframe
    dataframe = fetchData(sqlQuery)
    dataframe.rename(columns = {'nom':'rs_id_assoc'}) # Self-explanatory

    # Then we pass the dataframe to the client with json format
    return HttpResponse(dataframe.to_json(orient='records'))

def table_csv(request, rsID):
    print request

    # We'll need to get which phenotypes are selected.
    phenotype_selected = 'All cause death'

    # First we define the query
    sqlQuery="select distinct a.rs_id_assoc ,a.experiment, a.chromosome,a.pos,a.info_assoc,a.pvalue_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB,a.beta_assoc,a.maf, a.all_OR,xp.covariates,m.gene,m.gene_before,m.gene_after, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.allele_B when a.beta_assoc<0 and p.Risk_on_rise is true then a.allele_A when a.beta_assoc>0 and p.Risk_on_rise is false then a.allele_A when a.beta_assoc<0 and p.Risk_on_rise is false then a.allele_B end as risk_allele, case when a.beta_assoc>0 and p.Risk_on_rise is true then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is true then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc>0 and p.Risk_on_rise is false then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is false then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) end as risk_af, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.beta_assoc when a.beta_assoc<0 and p.Risk_on_rise is true then a.beta_assoc*(-1) when a.beta_assoc>0 and p.Risk_on_rise is false then a.beta_assoc*(-1) when a.beta_assoc<0 and p.Risk_on_rise is false then a.beta_assoc end as risk_allele_beta from assoc a join experiment xp on a.experiment=xp.idexperiment join phenotypes  p  on xp.phenotype=p.idphenotypes join marqueurs m on a.rs_id_assoc=m.nom where p.nom='"+phenotype_selected+"' and a.pvalue_assoc<0.001"

    # Then we fetch the data and store it in a dataframe
    dataframe = fetchData(sqlQuery)
    dataframe.rename(columns = {'nom':'rs_id_assoc'}) # Self-explanatory

    # We specify which columns we want to see displayed
    header = ["chromosome","rs_id_assoc"]
    # We set the HttpResponse to send our data in .csv format
    response = HttpResponse(dataframe.to_csv(columns=header, index=False), content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename=relevant_snps.csv' # Next : Add userName at the end to allow multiple users at the same time
    return response

# Logout
def logout(request):
    print request
    return HttpResponse('Logout')

