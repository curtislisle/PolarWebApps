
import bson.json_util
import pymongo
import json
from bson import ObjectId
from pymongo import Connection
import string
import tangelo

try:
    import ogr
except ImportError:
    from osgeo import ogr

def convertStringToFloatPoint(lng,lat):
    if lat[-1:] == "S":
        outlat= -float(lat[:-1])
    else:
        outlat = float(lat[:-1])    
    if lng[-1:] == "W":
        outlng = -float(lng[:-1])
    else:
        outlng = float(lng[:-1])
    point = {}
    point['lat'] = outlat
    point['lng'] = outlng
    return point


def run(tablename):
    # Create an empty response object.
    response = {}
    print "using collection:",tablename

    # first find out the types of the attributes in this collection. Create a dictionary with the names and types
    connection = Connection('localhost', 27017)
    db = connection['ivaan']
    dataset_collection = db[tablename]
    #tablerecord = dataset_collection.find()[0]

    # Now that we have the proper types in the table collection stored in a handy local dictionary "attributes", lets
    # build a query for mongoDB depending on how many filters are enabled.

    querystring = {}
    print "query to perform:", querystring

    # now that we have the query build, execute it and return the matching records from the collection

    connection = Connection('localhost', 27017)
    db = connection['polar']
    dataset_collection = db[tablename]

    # Do a find operation with the passed arguments.
    it = dataset_collection.find(querystring)
    results = [x for x in it]
   
    connection.close()

    print results

    # convert from the local json to a geojson multipoint result

    #latitudes = [30, 30, 30]
    #longitudes = [10, 20, 30]

    #define multipoint geometry
    multipoint = ogr.Geometry(ogr.wkbMultiPoint)

    #create point geometry and add to multipoint geometry
    for i in range(len(results)):
        point = ogr.Geometry(ogr.wkbPoint)
        fixedlocation = convertStringToFloatPoint(results[i]['stationLng'], results[i]['stationLat'])
        point.AddPoint(fixedlocation['lng'],fixedlocation['lat'])
        multipoint.AddGeometry(point)

    #convert geometry to GeoJSON format
    geojson_multipoint = multipoint.ExportToJson()


    # Pack the results into the response object, and return it.
    response['count'] = it.count()
    response['data'] = geojson_multipoint

    response['result'] = 'OK'

    # Return the response object.
    tangelo.log(str(response))
    return bson.json_util.dumps(response)
