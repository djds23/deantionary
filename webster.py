import json
import random
from functools import lru_cache


with open('dictionary.json', 'r') as f:
    data = f.read()
    data = json.loads(data)

class NoDefinitionException(Exception):
    def __init__(self, message):
        super(NoDefinitionException, self).__init__(message)
        

class Webster(object):
    english = data
    _keys = list(data.keys()) 

    def random_word(self, include_def=False):
        word =  random.choice(self._keys)
        if include_def:
            return word, self.english[word]
        return word

    def random_words(self, num, include_def=False):
        words = []
        for _ in range(num):
            words.append(self.random_word(include_def))
        return tuple(words)

    @lru_cache(maxsize=128)
    def define(self, word):
        return self.english.get(word.upper())

    @lru_cache()
    def define_or_suggest(self, word):
        definition = self.define(word)
        if definition:
            return definition
        return self.filter_similar(word)
        
    def filter_similar(self, word):
        partial_word = ''
        for i in range(len(word)):
            partial_word += word[i]
            word_list = list(
                filter(
                    lambda key: key.startswith(partial_word.upper()),
                    self._keys
                )
            )
            if len(word_list) <= 50:
                return word_list
        return word_list

