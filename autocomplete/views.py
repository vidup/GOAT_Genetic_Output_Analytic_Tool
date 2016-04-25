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

from django.shortcuts import render
from django.http import HttpResponse

#--- Tools ---#
from Tools import connect
from Tools import UserLogs

#--- Pandas Dataframes ---#
import pandas as pandas

#--- JSON ---#
import json

# Create your views here.

def autoCompleteGenes(request, text):
    #First, we fetch the genes starting by the text value
    sqlQuery = "select symbol from genes where symbol like '"+text+"%'"
    genesStarting = connect.fetchData(sqlQuery)
    #Same for the end of the name
    sqlQuery = "select symbol from genes where symbol like '%"+text+"'"
    genesEnding = connect.fetchData(sqlQuery)
    #Finally, same with the name containing the text value
    sqlQuery = "select symbol from genes where symbol like '%"+text+"%'"
    genesContaining = connect.fetchData(sqlQuery)
    #We merge the dataframes
    genes = pandas.merge(
        pandas.merge(
            genesStarting,
            genesEnding,
            on="symbol",
            how="outer"
        ),
        genesContaining,
        on="symbol",
        how="outer"
    )
    # UserLogs.add(
    #     'Victor Dupuy',
    #     '255.255.255.255',
    #     'accessed the module : AutoComplete',
    #     'MySQL Database',
    #     ['genes']
    # )
    genes = genes.to_json(orient='records')
    return HttpResponse(genes)

def AutoCompletePhenotypes(request, text):
    #First, we fetch the genes starting by the text value
    sqlQuery = "select nom from phenotypes where nom like '"+text+"%' and type='binomial'"
    phenotypesStarting = connect.fetchData(sqlQuery)
    #Same for the end of the name
    sqlQuery = "select nom from phenotypes where nom like '%"+text+"' and type='binomial'"
    phenotypesEnding = connect.fetchData(sqlQuery)
    #Finally, same with the name containing the text value
    sqlQuery = "select nom from phenotypes where nom like '%"+text+"%' and type='binomial'"
    phenotypesContaining = connect.fetchData(sqlQuery)

    #We merge the dataframes
    phenotypes = pandas.merge(
        pandas.merge(
            phenotypesStarting,
            phenotypesEnding,
            on="nom",
            how="outer"
        ),
        phenotypesContaining,
        on="nom",
        how="outer"
    )
    # UserLogs.add(
    #     'Victor Dupuy',
    #     '255.255.255.255',
    #     'accessed the module : AutoComplete',
    #     'MySQL Database',
    #     ['phenotypes']
    # )
    phenotypes = phenotypes.to_json(orient='records')
    return HttpResponse(phenotypes)
