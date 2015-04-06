import unittest
import json

from app import app
from webster import Webster


class WebsterTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.web = Webster()

    def test_webster_lookup(self):
        local_lookup = self.web.define('fun')
        web_resp = self.app.get('/define/fun')
        resp_json_object = json.loads(web_resp.data.decode('utf-8'))
        definition = resp_json_object['definition']
        self.assertEqual(local_lookup.definition, definition)

    def test_suggestions(self):
        misspelled_word = 'okad'
        local_lookup = self.web.define(misspelled_word)
        web_resp = self.app.get('/define/' + misspelled_word)
        resp_json_object = json.loads(web_resp.data.decode('utf-8'))
        definition = resp_json_object['definition']
        word = resp_json_object['word']
        self.assertEqual(local_lookup.word.capitalize(), word) 
        self.assertEqual(local_lookup.definition, definition)


if __name__=='__main__':
    unittest.main()
