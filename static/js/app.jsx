import React from 'react';
import $ from 'jquery';


React.initializeTouchEvents(true);

class InputForm extends React.Component {
    handleSubmit (e) {
        e.preventDefault();
        const wordVal = React.findDOMNode(this.refs.text).value.trim();
        this.props.onWordSubmit(wordVal);
        e.stopPropagation();
        window.location.hash = '#' + wordVal; 
        return;
    }

    render () {
        return ( 
            <form className="inputForm" onSubmit={this.handleSubmit.bind(this)}>
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
}

class WordDefinition extends React.Component {
    render () {
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
}

class DefinitionBox extends React.Component {
    takeSuggestion (e) {
        e.preventDefault();
        this.props.wordLookup(e.currentTarget.innerText);
    }

    render () {
        if (this.props.data.definition !== null) {
            return (
                <WordDefinition LookUpObject={this.props.data} />
            );        
        } else if (this.props.data.suggestions.length !== 0) {
            const suggestionNodes = this.props.data.suggestions.map((suggestion, index) => {
                return (
                    <div key={index} >
                        <WordDefinition LookUpObject={suggestion} />
                    </div>
                );
            });
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
}


class DictionaryBox extends React.Component {
    handleWordLookUp (word) {
        $.get(this.props.url + word).done(data => {
            this.setState({
                word: data.word, 
                definition: data.definition,
                suggestions: data.suggestions,
            }); 
        });
    }


    constructor () {
        super();
        this.state = {
            word: 'Deantionary', 
            definition: 'A silly dictionary you can use for free',
            suggestions: []
        };
    }

    componentDidMount () {
        const url_lookup = window.location.hash.slice(1); 
        if (url_lookup !== "" && this.state.word !== url_lookup) {
            this.handleWordLookUp(url_lookup);
        }
    }

    render () {
        return (
            <div className="dictionaryBox">
                <h1>Deantionary</h1>
                <InputForm onWordSubmit={this.handleWordLookUp.bind(this)} />
                <DefinitionBox data={this.state} wordLookup={this.handleWordLookUp.bind(this)} />
            </div>
        );
    }
}

React.render(
    <DictionaryBox url={$SCRIPT_ROOT + '/define/'} />,
    document.getElementById('content')
);
