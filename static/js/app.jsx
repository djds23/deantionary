React.initializeTouchEvents(true);

var InputForm = React.createClass({
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
            <form className="inputForm" onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="text" placeholder="Search for..." />
                            <span className="input-group-btn">
                                <input className="btn btn-default" type="submit" value="Define!" />
                            </span>
                        </div>
                    </div> 
                </div>
            </form>
       );
    }
});

var DefinitionBox = React.createClass({
    takeSuggestion: function (e) {
        e.preventDefault();
        this.props.wordLookup(e.currentTarget.innerText);
    },
    componentDidMount: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },
    render: function () {
        var correction = !this.props.data.found ? 'Did you mean... ' + this.props.data.word : this.props.data.word
        if (this.props.data.definition !== null) {
            return(
                <div>
                    <h5>
                        {correction}
                        <div className="pull-right">
                            <a data-toggle="tooltip" data-placement="top" title="Copy Link" href={$SCRIPT_ROOT + '/#' + this.props.data.word} >
                                <span className="glyphicon glyphicon-link" />
                            </a>
                        </div>
                    </h5>
                    <p> 
                        {this.props.data.definition}
                    </p>
                    
                </div>
            );
        } else if (this.props.data.suggestions.length !== 0) {
            var index = 0;
            var suggestionNodes = this.props.data.suggestions.map(function (suggestion) {
                index++;
                return (
                    <a key={index} href="" onClick={this.takeSuggestion} >
                        {suggestion}&nbsp;
                    </a>
                );
            }.bind(this));
            return ( 
                    <p>
                        Not sure I have that word, but what about one of these:&nbsp;
                        {suggestionNodes}
                    </p>
            );
        } else {
            return (
                <h2>
                    I do not know what {this.props.data.word} means!
                </h2>
            );
        }
    }
});


var DictionaryBox = React.createClass({
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
            <div className="dictionaryBox">
                <h1>Deantionary</h1>
                <InputForm onWordSubmit={this.handleWordLookUp} />
                <DefinitionBox data={this.state} wordLookup={this.handleWordLookUp} />
            </div>
        );
    }
});

React.render(
    <DictionaryBox url={$SCRIPT_ROOT + '/define/'} />,
    document.getElementById('content')
);
