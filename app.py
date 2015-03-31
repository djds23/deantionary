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
    definition_or_list = web.define_or_suggest(word)
    #import pdb; pdb.set_trace()
    if definition_or_list:
        if isinstance(definition_or_list, list):
            return jsonify(
                word=word.capitalize(), 
                suggestions=definition_or_list
            )
        else:
            return jsonify(
                word=word.capitalize(),
                definition=definition_or_list
            )
    return jsonify(error="not a word, cannot define") 


if __name__=='__main__':
    app.run(debug=True)
