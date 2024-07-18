from . import auth
from flask import render_template, request, redirect, url_for, flash
from pymongo import MongoClient

# # MongoDB Setup
# client = MongoClient('your_mongo_uri')
# db = client.your_db_name
# users = db.users

# @auth.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         email = request.form['email']
#         password = request.form['password']
#         user = users.find_one({"email": email, "password": password})
#         if user:
#             return redirect(url_for('main.dashboard'))
#         else:
#             flash('Invalid credentials')
#     return render_template('LoginPage.html')
