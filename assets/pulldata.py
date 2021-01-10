#!/usr/bin/env python3

import os
from urllib import request
from urllib.parse import urlparse


def pathCheck(pathStr:str):
    if urlparse(pathStr).netloc:
        reqObj = request.Request(url=pathStr, method="HEAD")
        request.urlopen(reqObj)  # if inaccessible exception will be raised
    else:
        workDir = os.path.abspath(os.path.expanduser(os.path.expandvars(pathStr)))
        dummyFile = os.path.join(workDir, "test.txt")
        f = open(dummyFile, "a")  # if inaccessible exception will be raised
        f.close()
        os.remove(dummyFile)
    return

def loadResource(urlStr:str):
    reqObj = request.Request(url=urlStr, method="GET")
    return request.urlopen(reqObj)

def main():
    # Initialisation of values
    sourceUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv"
    if os.getenv("GITHUB_WORKSPACE"):
        workDir = os.path.join(os.getenv("GITHUB_WORKSPACE"), "assets", "data")
    else:
        workDir = "./data"

    # Check if resources are accessible
    pathCheck(sourceUrl)
    pathCheck(workDir)

    # Load resource from URL
    lines = [i.decode('utf-8') for i in loadResource(sourceUrl).readlines()]  # convert byte type to str

    header = lines[0].split(',')
    dataName = [g for g in header if g not in ['iso_code', 'continent', 'location', 'date']]  # create a list of stats types
    del lines[0]  # remove header from list

    masterList = list()
    while lines:
        item = lines.pop()  # pick out the last item
        item = item.split(',')  # return a list of values in the item
        recordObj = dict()
        for x, y in zip(header, item):  # match header and value according to sequence
            if len(y):  # if value is not empty
                recordObj[x] = y
        masterList.append(recordObj)

    while masterList:
        entry = masterList.pop()  # pick out the last item
        for m, n in entry.items():  # scrutinise the recordObj by the pairs
            if m in dataName:  # if header value belongs to one of the stat types
                fileDir = os.path.join(workDir, entry["location"], m, entry["date"])
                os.makedirs(fileDir, exist_ok=True)
                open(os.path.join(fileDir, n), 'a').close()
                historyFile = os.path.join(workDir, entry["location"], m, "history.csv")
                with open(historyFile, 'a') as fileObj:
                    fileObj.write(entry["date"] + ',' + n + '\n')


if __name__ == "__main__":
    main()