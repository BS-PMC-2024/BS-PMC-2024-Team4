from flask import jsonify, request
import json
import os
from app.map import bp;
from app.extensions import mongo
import xml.etree.ElementTree as ET
import math

# Haversine formula to calculate distance between two points on a sphere given their longitudes and latituds.
def haversine(lat1, lon1, lat2, lon2):
    R = 6371 #Earth's radius

    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)

    # havθ = hav(Δφ)+cos(φ1)*cos(φ2)*hav(Δλ)
    # φ1,φ2 latitude of point 1 and 2
    # λ1,λ2 longitude of point 1 and 2
    # Δφ = φ2 - φ1
    # Δλ = λ2 - λ1
    # hav(Δφ) = sin^2(Δφ/2) | hav(Δλ) = sin^2(Δλ/2)
    a = math.sin(dLat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2) ** 2

    # distance = 2*r*arcsin(sqrt(havθ))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

def calcRoute(coords, routes, top_n=3):
    def closest_point(coord, route):
        closest_distance = float('inf')
        closest_point = None
        for point in route:
            distance = haversine(coord[0], coord[1], point[0], point[1])
            if distance < closest_distance:
                closest_distance = distance
                closest_point = point
        return closest_distance, closest_point

    closest_routes = []
    for route in routes:
        total_distance = 0
        distance, _ = closest_point(coords, route['route'])
        total_distance += distance
        closest_routes.append((total_distance, route))
    closest_routes.sort(key=lambda x: x[0])
    return list(map( lambda x: x[1] , closest_routes[:top_n]))


@bp.route('/paths', methods=['GET', 'POST'])
def paths():
    try:
        map_db = mongo.client.get_database("Map")
        routes = map_db.get_collection("routes")

        coords = request.get_json()['coords']

        allRoutes = routes.find({}, {"_id":0})

        routes = calcRoute(coords, allRoutes)

        return {"routes": routes}, 200
    except:
        return "Something went wrong while fetching routes", 404
    
@bp.route('/addRoute')
def addRoute():
    map_db = mongo.client.get_database("Map")
    routes = map_db.get_collection("routes")

    gpx_data = '''<?xml version="1.0" encoding="utf-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" creator="osrm" version="1.1"><metadata><name>, , מצדה, מצדה, מצדה</name><copyright author="OpenStreetMap contributors"><license>http://www.openstreetmap.org/copyright</license></copyright><link href="https://map.project-osrm.org/?z=18&amp;center=31.259474%2C34.790979&amp;loc=31.259156%2C34.797113&amp;loc=31.259211%2C34.795450&amp;loc=31.258463%2C34.794855&amp;loc=31.258431%2C34.792188&amp;loc=31.258839%2C34.789833&amp;loc=31.259151%2C34.787816&amp;hl=en&amp;alt=0&amp;srv=2"><text>OpenStreetMap Routing with Open Source Routing Machine</text></link><time>2024-08-05T17:42:57.982Z</time></metadata><trk><trkseg><trkpt lat="31.25916" lon="34.79711"/><trkpt lat="31.2592" lon="34.79644"/><trkpt lat="31.2592" lon="34.79634"/><trkpt lat="31.25922" lon="34.79554"/><trkpt lat="31.25922" lon="34.79545"/><trkpt lat="31.25922" lon="34.79545"/><trkpt lat="31.25922" lon="34.79545"/><trkpt lat="31.25922" lon="34.79554"/><trkpt lat="31.25922" lon="34.79554"/><trkpt lat="31.25914" lon="34.79554"/><trkpt lat="31.25914" lon="34.79542"/><trkpt lat="31.25914" lon="34.79542"/><trkpt lat="31.25911" lon="34.79543"/><trkpt lat="31.25876" lon="34.79544"/><trkpt lat="31.25869" lon="34.79545"/><trkpt lat="31.25869" lon="34.79529"/><trkpt lat="31.25866" lon="34.79526"/><trkpt lat="31.25863" lon="34.79523"/><trkpt lat="31.25862" lon="34.79495"/><trkpt lat="31.25865" lon="34.79492"/><trkpt lat="31.25865" lon="34.79492"/><trkpt lat="31.25852" lon="34.7949"/><trkpt lat="31.25848" lon="34.79488"/><trkpt lat="31.25846" lon="34.79486"/><trkpt lat="31.25846" lon="34.79486"/><trkpt lat="31.25846" lon="34.79486"/><trkpt lat="31.25842" lon="34.7948"/><trkpt lat="31.25842" lon="34.7948"/><trkpt lat="31.25842" lon="34.79422"/><trkpt lat="31.25842" lon="34.79219"/><trkpt lat="31.25842" lon="34.79219"/><trkpt lat="31.25842" lon="34.79219"/><trkpt lat="31.25842" lon="34.79199"/><trkpt lat="31.25843" lon="34.79187"/><trkpt lat="31.25843" lon="34.79179"/><trkpt lat="31.25844" lon="34.79171"/><trkpt lat="31.25846" lon="34.79155"/><trkpt lat="31.25851" lon="34.79135"/><trkpt lat="31.25852" lon="34.79128"/><trkpt lat="31.25867" lon="34.79058"/><trkpt lat="31.25882" lon="34.78983"/><trkpt lat="31.25882" lon="34.78983"/><trkpt lat="31.25882" lon="34.78983"/><trkpt lat="31.25883" lon="34.78981"/><trkpt lat="31.25889" lon="34.78948"/><trkpt lat="31.25894" lon="34.78926"/><trkpt lat="31.259" lon="34.78888"/><trkpt lat="31.25902" lon="34.78868"/><trkpt lat="31.25903" lon="34.78858"/><trkpt lat="31.25907" lon="34.78813"/><trkpt lat="31.25908" lon="34.78795"/><trkpt lat="31.25908" lon="34.78795"/><trkpt lat="31.25912" lon="34.78786"/><trkpt lat="31.25915" lon="34.78782"/><trkpt lat="31.25915" lon="34.78782"/></trkseg></trk></gpx>'''
    root = ET.fromstring(gpx_data)
    namespace = {'gpx': 'http://www.topografix.com/GPX/1/1'}
    trkpts = root.findall('.//gpx:trkpt', namespace)

    route_coords = [(float(trkpt.attrib['lat']), float(trkpt.attrib['lon'])) for trkpt in trkpts]

    data = {"route": route_coords, "route_name": "דרך מצדה 1"}

    routes.insert_one(data)

    return jsonify(data)