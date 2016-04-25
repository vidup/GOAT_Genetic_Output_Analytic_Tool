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

#!/usr/bin/Python-2.7.11

# Authors of this page : Beatriz Kanzki & Victor Dupuy


from Tools import connect
import pandas as pandas
from Tools import UserLogs

# Return one or several phenotypes significant with the input
def getSignigicantPhenotypes(type, value):
    phenotypes = pandas.DataFrame()

    # First we check the type of the input (rsID, Gene or Phenotype) and act accordingly
    UserLogs.add(
        'Victor Dupuy',
        '255.255.255.255',
        'accessed the module : Tools - getPhenotypes',
        'MySQL Database',
        ['assoc', 'marqueurs', 'phenotypes' , 'experiment']
    )
    treshold = "0.001"

    if type == "rsID":
        phenotypes = connect.fetchData("select p.nom From marqueurs m join assoc a on a.rs_id_assoc = m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where pvalue_assoc <"+treshold+" and m.nom in ('"+value+"') order by a.pvalue_assoc ASC")
    elif type == "gene":
        phenotypes = connect.fetchData("select DISTINCT p.nom From marqueurs m join assoc a on a.rs_id_assoc = m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where pvalue_assoc <"+treshold+" and (m.gene in ('"+value+"') or m.gene_before in ('"+value+"') or m.gene_after in ('"+value+"') ) order by a.pvalue_assoc ASC ")
    else:
        phenotypes = pandas.DataFrame(data={'nom': value}, index=[0])

    return phenotypes

def getAll():
    phenotypes = connect.fetchData("select nom from phenotypes where type='binomial';")
    return phenotypes
