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
    render: function () {
        if ("definition" in this.props.data && this.props.data.definition !== undefined) {
            return(
                React.createElement("div", null, 
                    React.createElement("h5", null, 
                        this.props.data.word, 
                        React.createElement("div", {className: "pull-right"}, 
                            React.createElement("a", {href: $SCRIPT_ROOT + '/#' + this.props.data.word}, 
                                React.createElement("span", {className: "glyphicon glyphicon-link"})
                            )
                        )
                    ), 
                    React.createElement("p", null, 
                        this.props.data.definition
                    )
                    
                )
            );
        } else if ("suggestions" in this.props.data && this.props.data.suggestions !== undefined) {
            var index = 0;
            var suggestionNodes = this.props.data.suggestions.map(function (suggestion) {
                index++;
                return (
                    React.createElement("a", {key: index, href: "", onClick: this.takeSuggestion}, 
                        suggestion, " "
                    )
                );
            }.bind(this));
            return ( 
                    React.createElement("p", null, 
                        "Not sure I have that word, but what about one of these: ", 
                        suggestionNodes
                    )
            );
        } else {
            return (
                React.createElement("h2", null, 
                    "I do not know what that means!"
                )
            );
        }
    }
});


var DictionaryBox = React.createClass({displayName: "DictionaryBox",
    handleWordLookUp: function (word) {
        $.get(this.props.url + word).done(function (data) {
            if ("suggestions" in data) {
                this.setState({
                    word: data.word, 
                    suggestions: data.suggestions, 
                    definition: undefined,
                    correction: undefined
                }); 
            } else if ("didyoumean" in data){
                this.setState({
                    word: data.didyoumean, 
                    definition: data.definition, 
                    suggestions: undefined, 
                    correction: true
                });
            } else {
                this.setState({
                    word: data.word, 
                    definition: data.definition, 
                    suggestions: undefined, 
                    correction: false
                });
            }
            window.location.hash = '#';
        }.bind(this));
    },
    getInitialState: function () {
            return {word: 'Deantionary', definition: 'A silly dictionary you can use for free'};
    },
    componentDidMount: function () {
        var url_lookup = window.location.hash.slice(1); 
        if (url_lookup !== "") {
            // Without this we will recursively call render
            this.handleWordLookUp(url_lookup);
            window.location.hash = "";
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
