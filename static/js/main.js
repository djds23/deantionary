React.initializeTouchEvents(true);

var InputForm = React.createClass({displayName: "InputForm",
    handleSubmit: function (e) {
        e.preventDefault();
        this.props.onWordSubmit(
            React.findDOMNode(this.refs.text).value.trim()
        );
        e.stopPropagation();
        return;
    },
    render: function () {
        return ( 
            React.createElement("form", {className: "inputForm", onSubmit: this.handleSubmit}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-lg-6"}, 
                        React.createElement("div", {className: "input-group"}, 
                            React.createElement("input", {type: "text", className: "form-control", ref: "text", placeholder: "Search for..."}), 
                            React.createElement("span", {className: "input-group-btn"}, 
                                React.createElement("input", {className: "btn btn-default", type: "submit", value: "Define!"})
                            )
                        )
                    )
                )
            )
       );
    }
});

var DefinitionBox = React.createClass({displayName: "DefinitionBox",
    takeSuggestion: function (e) {
        e.preventDefault();
        this.props.wordLookup(e.currentTarget.innerText);
    },
    constructWordDefinition: function (LookUpObject, index) {
        var correction = !LookUpObject.found ? 'Did you mean... ' + LookUpObject.word : LookUpObject.word
        return (
                React.createElement("div", null, 
                    React.createElement("h5", null, 
                        correction, 
                        React.createElement("div", {className: "pull-right"}, 
                            React.createElement("a", {"data-togglr": "tooltip", "data-placement": "top", title: "Copy Link", href: $SCRIPT_ROOT + '/#' + LookUpObject.word}, 
                                React.createElement("span", {className: "glyphicon glyphicon-link"})
                            )
                        )
                    ), 
                    React.createElement("p", null, 
                        LookUpObject.definition
                    )
                )
        );
    },
    componentDidMount: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },
    render: function () {
        if (this.props.data.definition !== null) {
            return this.constructWordDefinition(this.props.data, null);        
        } else if (this.props.data.suggestions.length !== 0) {
            var index = 0;
            var suggestionNodes = this.props.data.suggestions.map(function (suggestion) {
            var suggestionElement = this.constructWordDefinition(suggestion); 
                index++;
                return (
                    React.createElement("div", {key: index}, 
                        suggestionElement
                    )
                );
            }.bind(this));
            return ( 
                    React.createElement("p", null, 
                        "Not sure I have that word, but what about one of these: ", 
                        React.createElement("br", null), 
                        suggestionNodes
                    )
            );
        } else {
            return (
                React.createElement("h2", null, 
                    "I do not know what ", this.props.data.word, " means!"
                )
            );
        }
    }
});


var DictionaryBox = React.createClass({displayName: "DictionaryBox",
    handleWordLookUp: function (word) {
        $.get(this.props.url + word).done(function (data) {
            this.setState({
                word: data.word, 
                definition: data.definition,
                suggestions: data.suggestions,
                found: data.found
            }); 
            window.location.hash = '#';
        }.bind(this));
    },
    getInitialState: function () {
        return {
            word: 'Deantionary', 
            definition: 'A silly dictionary you can use for free',
            found: true,
            suggestions: []
        };
    },
    componentDidMount: function () {
        var url_lookup = window.location.hash.slice(1); 
        if (url_lookup !== "") {
            this.handleWordLookUp(url_lookup);
        }
    },
    render: function () {
        return (
            React.createElement("div", {className: "dictionaryBox"}, 
                React.createElement("h1", null, "Deantionary"), 
                React.createElement(InputForm, {onWordSubmit: this.handleWordLookUp}), 
                React.createElement(DefinitionBox, {data: this.state, wordLookup: this.handleWordLookUp})
            )
        );
    }
});

React.render(
    React.createElement(DictionaryBox, {url: $SCRIPT_ROOT + '/define/'}),
    document.getElementById('content')
);
