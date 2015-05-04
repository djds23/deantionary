import collections
import string
from functools import lru_cache
from itertools import chain


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

    def __init__(self, words_and_definitions):
        self.word_dict = {k.lower(): v for k, v in words_and_definitions.items()}
        self._keys = list(self.word_dict.keys())
        raw_definitions = [
            word.strip('.').lower() for definition in self.word_dict.values()
            for word in definition.split() 
        ] 
        spell_checker = SpellChecker(
            chain(
                words_and_definitions.keys(),
                raw_definitions
            )
        ) 
        self.spell_checker = spell_checker
    
    @lru_cache(maxsize=128)
    def cached_get(self, word):
        return self.word_dict.get(word)

    @lru_cache(maxsize=128)
    def cached_has_key(self, word):
        return word in self.word_dict.keys()

    @lru_cache()
    def define(self, word):
        word = word.lower()
        definition = self.cached_get(word)
        if definition:
            return dict(
                word=word.capitalize(), 
                definition=definition, 
                suggestions=None
            )

        suggestions = self.find_similar(word)
        return dict(
            word=word.capitalize(), 
            definition=None, 
            suggestions=suggestions
        )
        
    def find_similar(self, word):
        word_list = []
        possible_similarities = self.spell_checker.possible_corrections(word)
        for word in possible_similarities:
            definition = self.cached_get(word)
            if definition:
                word_list.append(dict(
                    word=word.capitalize(),
                    definition=definition,
                    suggestions=[]
                ))
        if word_list:
            return word_list
        for word in self.find_same_startswith(word):
            definition = self.cached_get(word)
            if definition:
                word_list.append(dict(
                    word=word.capitalize(),
                    definition=definition,
                    suggestions=[]
                ))
        return word_list

    def find_same_startswith(self, word):

        def sort_defined_words(word):
            '''return word frequency score'''
            return self.spell_checker.model.get(word)

        word_list = None
        partial_word = ''
        for i in range(len(word)):
            partial_word += word[i]
            word_list = self.spell_checker.model.keys() if not word_list else word_list
            word_list = list(
                filter(
                    lambda key: key.startswith(partial_word.lower()),
                    word_list
                )
            )
            word_list = list(
                filter(
                    lambda key: self.cached_has_key(key),
                    word_list
                )
            )
            if len(word_list) <= 50:
                word_list = list(
                    sorted(
                        word_list, 
                        key=sort_defined_words       
                    )
                )
                return word_list
        empty_word_list = []
        return empty_word_list

