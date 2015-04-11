from collections.abc import Iterator, Mapping 

def serialize_namedtuple(_object, return_dict=None):
    """
    A hacky way to convert nested namedtuples to nested dicts
    param: _object, return a dict object of the namedtuple
    """
    if not return_dict:
        return_dict = {}
    if isinstance(_object, tuple) and hasattr(_object, '_asdict'):
        inner_dict = _object._asdict()       
        for key, value  in inner_dict.items():
            return_dict[key] = serialize_namedtuple(
                value, 
                return_dict=return_dict
            )
        return return_dict
    if isinstance(_object, Iterator) or isinstance(_object, list):
        if isinstance(_object, Mapping):
            serialized_dict = {}
            for key, value in _object.items():
                new_value = serialize_namedtuple(value)
                serialized_dict.update(key, new_value)
            return serialized_dict
        serialized_list = []
        for value in _object:
            serialized_object = serialize_namedtuple(value)
            serialized_list.append(serialized_object)
        return serialized_list
    else:
        return _object
