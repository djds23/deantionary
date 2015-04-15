import React from 'react';
import $ from 'jquery';

React.initializeTouchEvents(true);

var InputForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();
        var wordVal = React.findDOMNode(this.refs.text).value.trim();
        this.props.onWordSubmit(wordVal);
        e.stopPropagation();
        window.location.hash = '#' + wordVal; 
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

var WordDefinition = React.createClass({
    render: function () {
        return (
                <div>
                    <a href={$SCRIPT_ROOT + '/#' + this.props.LookUpObject.word}>
                        <h5>
                            {this.props.LookUpObject.word}
                        </h5>
                    </a>
                    <p> 
                        {this.props.LookUpObject.definition}
                    </p>
                </div>
        );
    }
});

var DefinitionBox = React.createClass({
    takeSuggestion: function (e) {
        e.preventDefault();
        this.props.wordLookup(e.currentTarget.innerText);
    },
    render: function () {
        if (this.props.data.definition !== null) {
            return (
                <WordDefinition LookUpObject={this.props.data} />
            );        
        } else if (this.props.data.suggestions.length !== 0) {
            var index = 0;
            var suggestionNodes = this.props.data.suggestions.map(function (suggestion) {
                index++;
                return (
                    <div key={index} >
                        <WordDefinition LookUpObject={suggestion} />
                    </div>
                );
            }.bind(this));
            return (
                <div>
                    <p className="padding" >
                        I do not have that word, but maybe you meant... 
                    </p>
                    {suggestionNodes}
                </div>
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
            }); 
        }.bind(this));
    },
    getInitialState: function () {
        return {
            word: 'Deantionary', 
            definition: 'A silly dictionary you can use for free',
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
