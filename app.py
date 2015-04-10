from flask import Flask, jsonify, render_template, request

from webster import Webster
from utils import jsonify_namedtuple 


app = Flask(__name__)
web = Webster()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/words')
def words_view():
    word, definition = web.random_word(include_def=True)
    return jsonify(word=word.capitalize(), definition=definition)
    
@app.route('/define/<word>')
def define_view(word):
    word = word.strip()
    lookup = web.define(word)
    test= jsonify_namedtuple(lookup)
    import pdb; pdb.set_trace()
    var = 1
    return jsonify(
        word=lookup.word, 
        definition=lookup.definition,
        suggestions=lookup.suggestions,
        found=lookup.found
    )


if __name__=='__main__':
    app.run(debug=True)
