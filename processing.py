'''
This python script formats the CSV output of the RADAR model
'''
#!/usr/bin/python
import sys, json
import pandas as pd
import numpy as np
from sklearn import preprocessing

# Remove beginning of radar csv output
def parseCSV(mfile):
    details = pd.read_csv(mfile, error_bad_lines=False, warn_bad_lines=False)
    skip = details.shape[0]

    # Strip details and NaN
    model = pd.read_csv(mfile,skiprows=skip).dropna().drop('ID',1)
    ndecisions = int(details.iloc[skip-3,1])
    nobjectives = model.shape[1] - ndecisions - 1

    # Get unique decisions
    decisions = []
    for d in model.columns.values[0:ndecisions]:
        decisions.append( {
            'values': [i for i in model[d].unique()],
            'name': d
        })

    # Scale objectives columns
    ndecisions = len(decisions)
    ncols = model.shape[1]
    colsToScale = model.columns.values[ndecisions:ncols-1]
    # Toggle to scale columns in matrix
    # for c in colsToScale:
    #     colvals = model.values[:,model.columns.get_loc(c)].astype(float)
    #     col = preprocessing.scale(np.array(colvals))
    #     model.loc[:,c] = col.reshape(len(col),1)

    model = model.round(5)

    # Get unique objectives
    objectives = []
    for o in model.columns.values[ndecisions:ndecisions+nobjectives]:
        objectives.append({
            'values': [i for i in model[o].unique()],
            'name': o
        })

    # Overwrite radar csv result
    model.to_csv(mfile)

    return decisions, objectives



if __name__ == '__main__':
    args = sys.argv
    decisions, objectives = parseCSV(args[1])
    res = decisions, objectives

    print json.dumps(decisions)
    print json.dumps(objectives)
