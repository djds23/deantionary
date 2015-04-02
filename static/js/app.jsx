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
    render: function () {
        if ("definition" in this.props.data && this.props.data.definition !== undefined) {
            return(
                <div>
                    <h5>
                        {this.props.data.word}
                        <div className="pull-right">
                            <a href={$SCRIPT_ROOT + '/?define=' + this.props.data.word} >
                                <span className="glyphicon glyphicon-link" />
                            </a>
                        </div>
                    </h5>
                    <p> 
                        {this.props.data.definition}
                    </p>
                    
                </div>
            );
        } else if ("suggestions" in this.props.data && this.props.data.suggestions !== undefined) {
            var index = 0;
            var suggestionNodes = this.props.data.suggestions.map(function (suggestion) {
                index++;
                return (
                    <li key={index} >
                        <a onClick={this.takeSuggestion} >
                            {suggestion}
                        </a>
                    </li>
                );
            }.bind(this));
            return ( 
                <div className="btn-group" >
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" >
                        Try one of these <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        {suggestionNodes}
                    </ul>
                </div>
            );
        } else {
            return (
                <h2>
                    I do not know what that means!
                </h2>
            );
        }
    }
});


var DictionaryBox = React.createClass({
    handleWordLookUp: function (word) {
        $.get(this.props.url + word).done(function (data) {
            if ("suggestions" in data) {
                this.setState({word: data.word, suggestions: data.suggestions, definition: undefined}); 
            } else {
                this.setState({word: data.word, definition: data.definition, suggestions: undefined});
            }
        }.bind(this));
    },
    getInitialState: function () {
        return {word: 'Deantionary', definition: 'A silly dictionary you can use for free'};
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
