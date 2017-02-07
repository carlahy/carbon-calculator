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
    model = pd.read_csv(mfile,skiprows=skip).drop('ID',1).dropna()

    ndecisions = int(details.iloc[skip-3,1])
    nobjectives = model.shape[1] - ndecisions - 1

    # Get unique decisions
    decisions = []
    for d in model.columns.values[0:ndecisions]:
        decisions.append( {
            'values': [i for i in model[d].unique()],
            'name': d
        })

    # Get unique objectives
    objectives = [i for i in model.columns.values[ndecisions:ndecisions+nobjectives]]

    # Scale objectives columns
    ndecisions = len(decisions)
    ncols = model.shape[1]
    colsToScale = model.columns.values[ndecisions:ncols-1]
    for c in colsToScale:
        colvals = model.values[:,model.columns.get_loc(c)].astype(float)
        col = preprocessing.scale(np.array(colvals))
        model.loc[:,c] = col.reshape(len(col),1)


    # Overwrite radar csv result
    model.to_csv(mfile)

    return decisions, objectives



if __name__ == '__main__':
    args = sys.argv
    # args = json.loads(args)
    decisions, objectives = parseCSV(args[1])
    res = decisions, objectives

    print json.dumps(decisions)
    print json.dumps(objectives)
