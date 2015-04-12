from collections import namedtuple
import json
import unittest

from app import app
from utils import serialize_namedtuple
from webster import Webster, LookUp 


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

    def test_define_spellchecker_suggest(self):
        misspelled_word = 'okad'
        local_lookup = self.web.define(misspelled_word)
        web_resp = self.app.get('/define/' + misspelled_word)
        resp_json_object = json.loads(web_resp.data.decode('utf-8'))
        definition = resp_json_object['definition']
        word = resp_json_object['word']
        self.assertEqual(local_lookup.word.capitalize(), word) 
        self.assertEqual(local_lookup.definition, definition)

    def test_define_startswith_suggest(self):
        test_word = 'dean'
        local_lookup = self.web.define(test_word)
        local_serialized_lookup = local_lookup.serialize()
        local_suggestions = local_serialized_lookup['suggestions']
        web_resp = self.app.get('/define/' + test_word)
        resp_json_object = json.loads(web_resp.data.decode('utf-8'))
        suggestions = resp_json_object['suggestions']
        self.assertEqual(local_suggestions, suggestions)

class LookUpTestCase(unittest.TestCase):

    def test_dict_serialize_namedtuple(self):
        return_value = {
                'name': 'test',
                'inner_vals': 
                [{
                    'name': 'test',
                    'inner_vals': []
                    }]}
        Test = namedtuple('Test', ['name', 'inner_vals'])
        nt_for_serialization = Test(
            name='test',
            inner_vals= [
                Test(
                    name='test',
                    inner_vals=[]
                )
            ]
        )
        test_rv = serialize_namedtuple(nt_for_serialization)
        self.assertEqual(test_rv, return_value)

        
if __name__=='__main__':
    unittest.main()
