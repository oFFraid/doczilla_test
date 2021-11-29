Z8.define('org.zenframework.z8.template.controls.YoutubeField', {
    extend: 'Z8.form.field.Text',
    playerContainer: null,

    completeRender() {
        Z8.form.field.Text.prototype.completeRender.call(this);
        this.playerContainer = DOM.create("div", "youtube-container");
        DOM.append(this.getDom(), this.playerContainer);
    },
    setAttributes(el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    },
    appendVideo(url) {
        DOM.removeChildren(this.playerContainer);
        if (this.playerContainer && url) {
            const playerFrame = DOM.create("iframe");
            const searchParams = url.searchParams.get('v');
            this.setAttributes(playerFrame, {
                height: "315",
                src: `https://www.youtube.com/embed/${searchParams}`,
                title: "YouTube video player",
                frameborder: "0",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            });
            DOM.append(this.playerContainer, playerFrame);
        }
    },
    setValue(value, displayValue) {
        Z8.form.field.Text.prototype.setValue.call(this, value, displayValue);
        if (!value || !this.isValid()) {
            this.appendVideo(null);
            return;
        }
        const url = new URL(value);
        this.appendVideo(url);
    },
    validate: function () {
        var value = this.getValue();
        try {
            if (value) {
                const url = new URL(value);
                if ("www.youtube.com" !== url.hostname) {
                    throw new Error();
                }
            }
            this.setValid(true);
        } catch (e) {
            this.setValid(false);
        }
    }
});