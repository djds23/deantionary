import unittest
import json

from app import app
from webster import Webster


class WebsterTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.web = Webster()

    def test_webster_lookup(self):
        local_def = self.web.define('fun')
        web_resp = self.app.get('/define/fun')
        resp_json_object = json.loads(web_resp.data.decode('utf-8'))
        definition = resp_json_object['definition']
        self.assertEqual(local_def, definition)

    def test_suggestions(self):
        local_suggestions = self.web.define_or_suggest('okad')
        web_resp = self.app.get('/define/okad')
        resp_json_object = json.loads(web_resp.data.decode('utf-8'))
        suggestions = resp_json_object['suggestions']
        self.assertEqual(local_suggestions, suggestions)





if __name__=='__main__':
    unittest.main()
