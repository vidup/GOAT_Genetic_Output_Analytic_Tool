from Tools import connect
import pandas as pandas

# Return one or several phenotypes significant with the input
def getSignigicantPhenotypes(type, value):
    phenotypes = pandas.DataFrame()

    # First we check the type of the input (rsID, Gene or Phenotype) and act accordingly

    treshold = "0.001"

    if type == "rsID":
        phenotypes = connect.fetchData("select p.nom From marqueurs m join assoc a on a.rs_id_assoc = m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where pvalue_assoc <"+treshold+" and m.nom in ('"+value+"') order by a.pvalue_assoc ASC")
    elif type == "gene":
        phenotypes = connect.fetchData("select DISTINCT p.nom From marqueurs m join assoc a on a.rs_id_assoc = m.nom JOIN experiment xp on a.experiment = xp.idexperiment join phenotypes p on xp.phenotype=p.idphenotypes where pvalue_assoc <"+treshold+" and (m.gene in ('"+value+"') or m.gene_before in ('"+value+"') or m.gene_after in ('"+value+"') ) order by a.pvalue_assoc ASC ")
    else:
        phenotypes = pandas.DataFrame(data={'nom': value}, index=[0])

    return phenotypes

def getAllPhenotypes():
    phenotypes = connect.fetchData("select p.nom from phenotypes;")
