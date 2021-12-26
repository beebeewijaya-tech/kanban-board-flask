from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.String(500), nullable=False, default=datetime.utcnow())
    status = db.Column(db.String(255), nullable=False)

    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}

# Comment this if not use
# db.create_all()

@app.route("/")
def home():
    todos_query = Todo.query.all()
    todos = [todo.as_dict() for todo in todos_query]
    return render_template("home.html", todos=todos)

@app.route("/add", methods=["POST"])
def add():
    if request.method == "POST":
        todo_resp = request.get_json()
        todo = Todo(
            task=todo_resp["task"],
            status=todo_resp["status"],
        )
        db.session.add(todo)
        db.session.commit()
        db.session.flush()

        resp = {
            "todo": {
                "id": todo.id,
                "status": todo.status,
                "task": todo.task,
            },
            "message": f"Successfully add todo {todo.task}"
        }
        return jsonify(resp)

    return render_template("home.html")


@app.route("/edit/<id>", methods=["PUT"])
def edit(id):
    if request.method == "PUT":
        status = request.get_json()
        todo = Todo.query.filter_by(id=id).first()
        todo.status = status["status"]

        db.session.commit()

        resp = {
            "todo": {
                "id": todo.id,
                "status": todo.status,
                "task": todo.task,
            },
            "message": f"Successfully edit todo {todo.task}"
        }
        return jsonify(resp)
    return render_template("home.html")

@app.route("/delete<id>")
def delete():
    return render_template("home.html")

app.run(port=5050, debug=True)