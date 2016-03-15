from django.db import connection # To connect to the database
import pandas as pandas

# Returns a dataframe containing the data returned b the SQL Query
def fetchData(sqlQuery):
    return pandas.read_sql(sqlQuery, connection)
