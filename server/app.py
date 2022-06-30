from flask import Flask
app = Flask(__name__)


@app.route('/js/<path:path>')
def send_report(path):
    return send_from_directory('js', path)

@app.route('/js/<path:path>')
def send_report(path):
    return send_from_directory('js', path)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
