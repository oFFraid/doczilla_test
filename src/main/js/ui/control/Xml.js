Z8.define('org.zenframework.z8.template.controls.Xml', {
	extend: 'Z8.form.field.TextArea',
	decorator: null,

	completeRender() {
		const parserColorConfig = {
			whitespace: /\s+/,
			number: /0x[\dA-Fa-f]+|-?(\d+\.?\d*|\.\d+)|#[\dA-Fa-f]{3,6}/,
			comment: /\/\*([^\*]|\*[^\/])*(\*\/?)?|(\/\/|#)[^\r\n]*/,
			string: /"(\\.|[^"\r\n])*"?|'(\\.|[^'\r\n])*'?/,
			keyword: /(and|as|case|catch|class|const|def|delete|die|do|else|elseif|esac|exit|extends|false|fi|finally|for|foreach|function|global|if|new|null|or|private|protected|public|published|resource|return|self|static|struct|switch|then|this|throw|true|try|var|void|while|xor)(?!\w|=)/,
			variable: /[\$\%\@](\->|\w)+(?!\w)|\${\w*}?/,
			define: /[$A-Z_a-z0-9]+/,
			op: /[\+\-\*\/=<>!]=?|[\(\)\{\}\[\]\.\|]/,
			other: /\S/,
		}
		const parser = new ParserColor(parserColorConfig);
		const textarea = DOM.selectNode(this, 'textarea');
		this.decorator = new TextareaDecorator(textarea, parser);
		Z8.form.field.TextArea.prototype.completeRender.call(this);
	},
	setValue(value, displayValue) {
		Z8.form.field.TextArea.prototype.setValue.call(this, value, displayValue);
		if (this.decorator) {
			this.decorator.update();
		}
	}
});