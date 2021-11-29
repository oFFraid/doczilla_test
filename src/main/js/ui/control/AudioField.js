Z8.define('org.zenframework.z8.template.controls.AudioField', {
    extend: 'Z8.form.field.File',
    playTrigger: null,
    player: null,
    isPlay: false,
    allowedFormats: ["mp3"],

    //метод File.initTriggers переопределяется не корректно
    //сбивается порядок иконок в triggers, в связи с этим
    //иконка скачивания становится иконкой закгрузки
    initTriggers: function () {
        var triggers = this.triggers;
        triggers.push({ icon: 'fa-play', tooltip: "воспроизвести", handler: this.onPlay, scope: this });
        triggers.push({ icon: 'fa-upload', tooltip: Z8.$('FileBox.uploadAFile'), handler: this.onUploadFile, scope: this });
        triggers.push({ icon: 'fa-download', tooltip: Z8.$('FileBox.downloadAFile'), handler: this.onDownloadFile, scope: this });

        TextBox.prototype.initTriggers.call(this);
        // Z8.form.field.File.prototype.initTriggers.call(this);

        this.playTrigger = this.getTriggerFixed(0);
        this.uploadTrigger = this.getTriggerFixed(1);
        this.downloadTrigger = this.getTriggerFixed(2);
    },
    //метод TextBox.getTrigger работает не корректно
    //При передачи 0 возвращает последний элемент
    getTriggerFixed(index) {
        var triggers = this.triggers;
        if (typeof index === "number") {
            return triggers[index];
        }
        return triggers[triggers.length - 1];
    },
    setIsPlay(value = null) {
        if (typeof value === "boolean") {
            this.isPlay = value;
            return;
        }
        this.isPlay = !this.isPlay;
    },
    updateTriggers() {
        const valueIsEmpty = Z8.isEmpty(this.getValue())
        Z8.form.field.File.prototype.updateTriggers.call(this);
        if (this.playTrigger) {
            if (valueIsEmpty || !this.isValid()) {
                this.playTrigger.show(false);
                return
            }
            this.playTrigger.show(true);
            this.playTrigger.setIcon(this.isPlay ? "fa-pause" : "fa-play");
        }
    },
    completeRender() {
        Z8.form.field.File.prototype.completeRender.call(this);
        this.player = DOM.create("audio", "audio-player");
        DOM.append(this.getDom(), this.player);
    },
    resetPlayer() {
        const player = this.player;
        player.pause();
        this.setIsPlay(false);
        this.updateTriggers();
    },
    onPlay() {
        if (this.isValid()) {
            const player = this.player;
            if (!this.isPlay) {
                player.play().then(() => {
                    this.setIsPlay(true);
                    this.updateTriggers();
                }).catch(() => {
                    this.resetPlayer();
                    this.setValid(false);
                })
            } else {
                this.resetPlayer();
            }
        }
    },
    getSrcFile(path, id) {
        return encodeURI((window._DEBUG_ ? '/' : '')
            + path.replace(/\\/g, '/'))
            + ('?&session=' + Application.session)
            + (id != null ? '&id=' + id : '');
    },
    setPlayerSrc(value = null) {
        const player = this.player;
        if (!player) return;
        if (!value) {
            player.src = "";
            return;
        }
        player.src = value;
    },
    setValue(value, displayValue) {
        Z8.form.field.File.prototype.setValue.call(this, value, displayValue);
        if (Z8.isEmpty(this.player)) return;
        this.resetPlayer();
        if (value.length && this.isValid()) {
            const file = value[0];
            const link = this.getSrcFile(file.path, file.id);
            this.setPlayerSrc(link);
        } else {
            this.setPlayerSrc("");
        }
    },
    validate() {
        let isValid = true;
        let value = this.getValue();
        if (!Z8.isEmpty(value)) {
            const splittedValue = value[0].name.split(".");
            const format = splittedValue[splittedValue.length - 1];
            if (!this.allowedFormats.includes(format.toLowerCase())) {
                isValid = false;
            }
        }
        this.setValid(isValid);
    }
});