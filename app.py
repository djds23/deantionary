from flask import Flask, jsonify, render_template, request

from webster import Webster


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
    if lookup.found:
        return jsonify(
            word=word.capitalize(),
            definition=lookup.definition
        )
    if lookup.word != word:
        return jsonify(
            didyoumean=lookup.word.capitalize(),
            word=word.capitalize(),
            definition=lookup.definition
        )
    else:
        return jsonify(
            word=word,
            suggestions=lookup.suggestions
        )
    return jsonify(error="not a word, cannot define") 


if __name__=='__main__':
    app.run(debug=True)
