from flask import Blueprint

ld = Blueprint('temperature', __name__)

from app.atomation import routes