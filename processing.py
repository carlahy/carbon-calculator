#!/usr/bin/python
import sys, json
import pandas as pd
import numpy as np

def getmatrix(mfile):
    analysis = pd.read_csv(mfile, error_bad_lines=False, warn_bad_lines=False)
    skip = analysis.shape[0]
    model = pd.read_csv(mfile,skiprows=skip).drop('ID',1).dropna()

    model.to_csv(mfile)
    return



if __name__ == '__main__':
    args = sys.argv
    # args = json.loads(args)
    getmatrix(args[1])
