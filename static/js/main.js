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

var WordDefinition = React.createClass({displayName: "WordDefinition",
    render: function () {
        return (
                React.createElement("div", null, 
                    React.createElement("a", {"data-togglr": "tooltip", "data-placement": "top", title: "Copy Link", href: $SCRIPT_ROOT + '/#' + this.props.LookUpObject.word}, 
                        React.createElement("h5", null, 
                            this.props.LookUpObject.word
                        )
                    ), 
                    React.createElement("p", null, 
                        this.props.LookUpObject.definition
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
    componentDidMount: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },
    render: function () {
        if (this.props.data.definition !== null) {
            return (
                React.createElement(WordDefinition, {LookUpObject: this.props.data})
            );        
        } else if (this.props.data.suggestions.length !== 0) {
            var index = 0;
            var suggestionNodes = this.props.data.suggestions.map(function (suggestion) {
                index++;
                return (
                    React.createElement("div", {key: index}, 
                        React.createElement(WordDefinition, {LookUpObject: suggestion})
                    )
                );
            }.bind(this));
            return (
                React.createElement("div", null, 
                    React.createElement("p", {className: "padding"}, 
                        "I do not have that word, but maybe you meant..." 
                    ), 
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
        if (url_lookup !== "" && this.state.word !== url_lookup) {
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
