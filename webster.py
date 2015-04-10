import collections
import json
import random
import string
from functools import lru_cache
from itertools import chain


with open('dictionary.json', 'r') as f:
    data = f.read()
    data = json.loads(data)

class SpellChecker(object):

    def __init__(self, wordbag):
        self.model = collections.Counter(wordbag)
        self.alphabet = str(string.ascii_lowercase)
        
    def _check1(self, word):
        splits = [(word[:i], word[i:]) for i in range(len(word) + 1)]
        deletes = [a + b[1:] for a, b in splits if b]
        transposes = [a + b[1] + b[0] + b[2:] for a, b in splits if len(b)>1]
        replaces = [a + c + b[1:] for a, b in splits for c in self.alphabet if b]
        inserts = [a + c + b for a, b in splits for c in self.alphabet]
        return set(deletes + transposes + replaces + inserts)

    def _known_edits2(self, word):
        return set(e2 for e1 in self._check1(word) for e2 in self._check1(e1) if e2 in self.model)

    def _known(self, words):
        return set(w for w in words if w in self.model)

    def correct(self, word):
        candidates = (self._known([word]) or self._known(self._check1(word))
                or self._known_edits2(word) or [word])
        return max(candidates, key=self.model.get)
    
    def possible_corrections(self, word):
        candidates = (self._known([word]) or self._known(self._check1(word))
                or self._known_edits2(word) or [word])
        words = []
        while candidates:
            possible_word = max(candidates, key=self.model.get)
            words.append(possible_word)
            candidates.remove(possible_word)
        return words


class Webster(object):
    # ensure words are lowercase
    english = {k.lower(): v for k, v in data.items()}
    _keys = list(english.keys()) 

    def __init__(self):
        raw_definitions =[ 
            word.strip('.').lower() for definition in self.english.values() 
            for word in definition.split() 
        ] 
        spell_checker = SpellChecker(
            chain(
                data.keys(), 
                raw_definitions
            )
        ) 
        self.spell_checker = spell_checker
        self.LookUp = collections.namedtuple('LookUp', [
            'found',
            'word',
            'definition',
            'suggestions'
        ])

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
    def cached_get(self, word):
        return self.english.get(word)

    @lru_cache(maxsize=128)
    def cached_haskey(self, word):
        return self.english.haskey(word)

    @lru_cache()
    def define(self, word):
        word = word.lower()
        definition = self.cached_get(word)
        if definition:
            return self.LookUp(
                found=True, 
                word=word.capitalize(), 
                definition=definition, 
                suggestions=None
            )

        correction = self.spell_checker.correct(word)
        if correction == word:
            return self.LookUp(
                found=False, 
                word=word.capitalize(), 
                definition=None, 
                suggestions=self.find_similar(word)
            )

        corrected_definition = False #self.cached_get(correction)  
        if corrected_definition:
            return self.LookUp(
                found=False, 
                word=correction.capitalize(), 
                definition=corrected_definition, 
                suggestions=None
            ) 


        return self.LookUp(
            found=False, 
            word=word.capitalize(), 
            definition=None, 
            suggestions=self.find_similar(word)
        )
        
    def find_similar(self, word):
        word_list = []
        possible_similarities = self.spell_checker.possible_corrections(word)
        for word in possible_similarities:
            definition = self.cached_get(word)
            if definition:
                word_list.append(self.LookUp(
                    found=False,
                    word=word.capitalize(),
                    definition=definition,
                    suggestions=[]
                ))
        return word_list


    def find_same_startswith(self, word):
        partial_word = ''
        for i in range(len(word)):
            partial_word += word[i]
            word_list = list(
                filter(
                    lambda key: key.startswith(partial_word.lower()),
                    self._keys
                )
            )
            if len(word_list) <= 50:
                return word_list[0:5]
        return word_list

