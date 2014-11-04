
import bson.json_util
import pymongo
import json
from bson import ObjectId
from pymongo import Connection
import string
import tangelo

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

    # Create an object to structure the results.
    response['count'] = it.count()
    response['data'] = results

    connection.close()

    # Pack the results into the response object, and return it.
    response['result'] = 'OK'

    # Return the response object.
    tangelo.log(str(response))
    return bson.json_util.dumps(response)
