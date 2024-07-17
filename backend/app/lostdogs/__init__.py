from flask import Blueprint

ld = Blueprint('lostDog', __name__)

from app.lostdogs import routes