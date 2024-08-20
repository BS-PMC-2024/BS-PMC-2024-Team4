from app.main import bp
from flask import render_template, request, redirect, url_for, flash
from app.extensions import mongo


db = mongo.client.get_database("Users")
users = db.get_collection("admins")

@bp.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = users.find_one({"email": email, "password": password})
        if user:
            # Log successful login or redirect to home page
            return redirect(url_for('main.Main'))
        else:
            # Log unsuccessful login and flash a message
            flash('Invalid mail or password')
            print("Failed login attempt with:", email, password)  
    return render_template('LoginPage.html')


@bp.route('/Main')
def Main():
    # flash('You have been logged out.')
    # return redirect(url_for('main.login'))  
    return render_template('HomePage.html')