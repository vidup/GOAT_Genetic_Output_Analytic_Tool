# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# Authors of this page : Beatriz Kanzki & Victor Dupuy

#!/usr/bin/Python-2.7.11


#---- Django tools for connection ----#
from django.db import connection # To connect to the database
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
#---- Responses ----#
from django.http import HttpResponse # To send an http response to the client
from django.http import JsonResponse # To send JSON formated data to the client
from django.shortcuts import render
import json

#--- Pandas ---#
import pandas as pandas
import numpy as numpy
import pandas.io.sql as psql

#--- Tools ---#
from Tools import getPhenotypes
from Tools import connect
from Tools import UserLogs

# - - - - - - - - - - - - - - - - - - - - - - - - - - - Variables - - - - - - - - - - - - - - - - - - - - - - - - - -  #

# THIS IS TEMPORARY. WILL BE REPLACED BY A SESSION SYSTEM AND USER.PY INSTANCES IN WHICH WE'LL STORE THIS DATA
global data

# - - - - - - - - - - - - - - - - - - - - - - - - - - - Views - - - - - - - - - - - - - - - - - - - - - - - - - - - -  #

# Index View
def index(request):
    print request
    return render(request, 'index.html')

# Login
def login(request):
    print request
    if request.user.is_authenticated():
        return HttpResponse('Already Logged in !')
    else:
        username = request.POST['userName']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                request.session.set_expiry(300)
                return HttpResponse('Success ! You\'re logged in !')
            else:
                return HttpResponse('Disconnected due to inactivity !')
        else:
            return HttpResponse('Login Failed !')
    return HttpResponse('Success')

# HTML Table & Static Manhattan file
def table(request, type, value):
    print request, type, value
    global data

    UserLogs.add(
        'Victor Dupuy',
        '255.255.255.255',
        'accessed the module : Web',
        'MySQL Database',
        ['assoc', 'phenotypes', 'marqueurs']
    )

    # We'll need to get which phenotypes are selected.
    significantPhenotypes = getPhenotypes.getSignigicantPhenotypes(type, value)
    if significantPhenotypes.any()['nom']: # Check if there are significant phenotypes
        phenotype_selected = getPhenotypes.getSignigicantPhenotypes(type, value).iat[0,0] #This gets the name of the significant phenotype
        print significantPhenotypes
        # First we define the query
        sqlQuery = "select distinct a.rs_id_assoc,a.chromosome,a.pos,a.pvalue_assoc,m.gene_before,m.gene,m.gene_after,a.experiment,a.info_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB,a.beta_assoc,a.maf,a.all_OR,xp.covariates, p.nom, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.allele_B when a.beta_assoc<0 and p.Risk_on_rise is true then a.allele_A when a.beta_assoc>0 and p.Risk_on_rise is false then a.allele_A when a.beta_assoc<0 and p.Risk_on_rise is false then a.allele_B end as risk_allele, case when a.beta_assoc>0 and p.Risk_on_rise is true then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is true then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc>0 and p.Risk_on_rise is false then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is false then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) end as risk_af, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.beta_assoc when a.beta_assoc<0 and p.Risk_on_rise is true then a.beta_assoc*(-1) when a.beta_assoc>0 and p.Risk_on_rise is false then a.beta_assoc*(-1) when a.beta_assoc<0 and p.Risk_on_rise is false then a.beta_assoc end as risk_allele_beta from assoc a join experiment xp on a.experiment=xp.idexperiment join phenotypes  p  on xp.phenotype=p.idphenotypes join marqueurs m on a.rs_id_assoc=m.nom where p.nom='"+phenotype_selected+"' and a.pvalue_assoc<0.001"

        # Then we fetch the data and store it in a dataframe
        dataframe = connect.fetchData(sqlQuery)
        # dataframe.rename(columns={'rs_id_assoc':'rs id assoc'})  #Self-explanatory
        data = dataframe
        dataframe.rename(columns = {
            'rs_id_assoc': 'rs_ID',
            'pos': 'Pos',
            'chromosome': 'Chr',
            'gene_before': 'GeneBefore',
            'pvalue_assoc': 'P-value',
            'allele_A': 'Allele A',
            'allele_B': 'Allele B',
            'cohort_AA' : 'cohort AA',
            'cohort_BB' : 'cohort BB',
            'beta_assoc' : 'Beta Assoc',
            'covariates' : 'Covariates',
            'risk_allele' : 'Risk Allele',
            'risk_af' : 'Risk Af',
            'risk_allele_beta' : 'Risk Allele Beta',
            'gene': 'Gene',
            'gene_after': 'GeneAfter',
            'nom' : 'Phenotype'
        }, inplace=True)  #rename column to make them look nicer
        jsonData = dataframe.to_json(orient='records')
        significantPhenotypes.rename(columns={'nom' : 'Phenotypes'}, inplace=True);
        # Then we pass the dataframe to the client with json format
        response = json.dumps({
                'noResult' : False,
                'phenotypes': significantPhenotypes.to_json(orient='records'),
                'data' : jsonData
            },
            sort_keys=True,
            indent=4,
            separators=(',', ': ')
        )
        return HttpResponse(response)
    else:
        print "There is no phenotype !"
        response = json.dumps({
                'noResult' : True,
                'phenotypes': [],
                'data' : []
            },
            sort_keys=True,
            indent=4,
            separators=(',', ': ')
        )
        return HttpResponse(response)

def snpsForGene(request, gene):
    print request

    # We'll need to get which phenotypes are selected.
    significantPhenotypes = getPhenotypes.getSignigicantPhenotypes("gene", gene)
    if significantPhenotypes.any()['nom']: # Check if there are significant phenotypes
        phenotype_selected = significantPhenotypes.iat[0,0] #This gets the name of the significant phenotype

        # First we define the query
        sqlQuery = "select distinct a.rs_id_assoc,a.chromosome,a.pos,a.pvalue_assoc,m.gene_before,m.gene,m.gene_after,a.experiment,a.info_assoc,a.allele_A,a.allele_B,a.cohort_AA,a.cohort_BB,a.beta_assoc,a.maf,a.all_OR,xp.covariates, p.nom, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.allele_B when a.beta_assoc<0 and p.Risk_on_rise is true then a.allele_A when a.beta_assoc>0 and p.Risk_on_rise is false then a.allele_A when a.beta_assoc<0 and p.Risk_on_rise is false then a.allele_B end as risk_allele, case when a.beta_assoc>0 and p.Risk_on_rise is true then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is true then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc>0 and p.Risk_on_rise is false then ( (2*a.cohort_AA) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) when a.beta_assoc<0 and p.Risk_on_rise is false then ( (2*a.cohort_BB) + a.cohort_AB ) / ((2*a.cohort_AA) + (2*a.cohort_AB) +(2*a.cohort_BB) ) end as risk_af, case when a.beta_assoc>0 and p.Risk_on_rise is true then a.beta_assoc when a.beta_assoc<0 and p.Risk_on_rise is true then a.beta_assoc*(-1) when a.beta_assoc>0 and p.Risk_on_rise is false then a.beta_assoc*(-1) when a.beta_assoc<0 and p.Risk_on_rise is false then a.beta_assoc end as risk_allele_beta from assoc a join marqueurs m on a.rs_id_assoc=m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where a. pvalue_assoc<0.001 and p.nom like '%"+phenotype_selected+"%' and (m.gene like '%"+gene+"%' or m.gene_after like '%"+gene+"%' or m.gene_before like '%"+gene+"%');"
        # Then we fetch the data and store it in a dataframe
        dataframe = connect.fetchData(sqlQuery)

        UserLogs.add(
            'Victor Dupuy',
            '255.255.255.255',
            'accessed the module : Web',
            'MySQL Database',
            ['assoc', 'phenotypes', 'marqueurs']
        )

        dataframe.rename(columns = {
            'rs_id_assoc': 'rs_ID',
            'pos': 'Pos',
            'chromosome': 'Chr',
            'gene_before': 'GeneBefore',
            'pvalue_assoc': 'P-value',
            'allele_A': 'Allele A',
            'allele_B': 'Allele B',
            'cohort_AA' : 'cohort AA',
            'cohort_BB' : 'cohort BB',
            'beta_assoc' : 'Beta Assoc',
            'covariates' : 'Covariates',
            'risk_allele' : 'Risk Allele',
            'risk_af' : 'Risk Af',
            'risk_allele_beta' : 'Risk Allele Beta',
            'gene': 'Gene',
            'gene_after': 'GeneAfter',
            'nom' : 'Phenotype'
        }, inplace=True)  #rename column to make them look nicer

        jsonData = dataframe.to_json(orient='records')
        significantPhenotypes.rename(columns={'nom' : 'Phenotypes'}, inplace=True);
        # Then we pass the dataframe to the client with json format
        response = json.dumps({
                'noResult' : False,
                'phenotypes': significantPhenotypes.to_json(orient='records'),
                'data' : jsonData
            },
            sort_keys=True,
            indent=4,
            separators=(',', ': ')
        )
        return HttpResponse(response)
    else:
        print "There is no phenotype !"
        response = json.dumps({
                'noResult' : True,
                'phenotypes': [],
                'data' : []
            },
            sort_keys=True,
            indent=4,
            separators=(',', ': ')
        )
        return HttpResponse(response)


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
