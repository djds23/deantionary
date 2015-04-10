from flask import jsonify

def jsonify_namedtuple(_namedtuple, return_dict=None):
    """
    A hacky way to convert nested namedtuples to nested dicts
    param: _namedtuple, return a dict object of the namedtuple
    """
    if not return_dict:
        return_dict = {}
    if isinstance(tuple, _namedtuple) and hasattr(_namedtuple, '_asdict()'):
        _namedtuple._asdict()
